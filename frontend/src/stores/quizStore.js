import { defineStore } from 'pinia';
import { getQuestionTranslations } from '@/utils/translate';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    // Auth
    authToken: localStorage.getItem('gcp_pca_auth_token') || null,
    currentUser: (() => {
      try {
        return JSON.parse(localStorage.getItem('gcp_pca_user_profile') || 'null');
      } catch (e) {
        return null;
      }
    })(),
    googleClientId: null,

    // Exam Tracks Catalog
    activeExamId: localStorage.getItem('gcp_active_exam') || 'gcp-pca',
    examsCatalog: [],
    
    // Quiz Catalog & Active Simulation
    quizDatabase: null,
    activeQuiz: null,
    selectedMode: 'simulado', // 'simulado' | 'exame'
    currentQuestionIndex: 0,
    savedProgressMap: {},

    userAnswers: {}, // { [questionId]: ['A'] }
    flaggedQuestions: {}, // { [questionId]: true }
    revealedExplanations: {}, // { [questionId]: true }
    
    // Timer
    timeRemaining: 120 * 60,
    timeElapsed: 0,
    timerInterval: null,
    isTimerRunning: false,

    // Results
    lastResults: null,

    // Languages & Preferences
    uiLanguage: localStorage.getItem('gcp_pca_ui_lang') || 'pt', // 'pt' | 'en'
    questionLanguage: localStorage.getItem('gcp_pca_question_lang') || 'pt', // 'pt' | 'en'
    isDarkMode: localStorage.getItem('gcp_pca_theme') === 'dark',

    // UI Dialogs & Drawers
    isExamDrawerOpen: false,
    isLegalDrawerOpen: false,
    activeLegalTab: 'disclaimer',
    isMobileNavDrawerOpen: false,
    currentScreen: 'dashboard' // 'login' | 'dashboard' | 'quiz' | 'results'
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.authToken && state.currentUser),
    theme: (state) => (state.isDarkMode ? 'dark' : 'light'),
    lang: (state) => state.uiLanguage,
    
    activeExam: (state) => {
      if (!state.examsCatalog || state.examsCatalog.length === 0) return null;
      return state.examsCatalog.find(e => e.id === state.activeExamId) || state.examsCatalog[0];
    },

    currentQuestion: (state) => {
      if (!state.activeQuiz || !state.activeQuiz.questions) return null;
      return state.activeQuiz.questions[state.currentQuestionIndex] || null;
    },

    totalQuestions: (state) => {
      return state.activeQuiz?.questions?.length || 60;
    },

    answeredCount: (state) => {
      return Object.keys(state.userAnswers).length;
    },

    progressPercentage: (state) => {
      if (!state.activeQuiz || !state.activeQuiz.questions || state.activeQuiz.questions.length === 0) return 0;
      return Math.round(((state.currentQuestionIndex + 1) / state.activeQuiz.questions.length) * 100);
    },

    timeDisplay: (state) => {
      const totalSecs = state.selectedMode === 'exame' ? state.timeRemaining : state.timeElapsed;
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  },

  actions: {
    // Theme Management
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('gcp_pca_theme', this.isDarkMode ? 'dark' : 'light');
      this.applyTheme();
    },

    applyTheme() {
      const html = document.documentElement;
      if (this.isDarkMode) {
        html.classList.add('dark-mode');
        html.setAttribute('data-theme', 'dark');
      } else {
        html.classList.remove('dark-mode');
        html.setAttribute('data-theme', 'light');
      }
    },

    // Language Management
    setUILanguage(lang) {
      this.uiLanguage = lang;
      localStorage.setItem('gcp_pca_ui_lang', lang);
      document.documentElement.lang = (lang === 'pt' || lang === 'bi') ? 'pt-BR' : 'en';
    },

    setQuestionLanguage(lang) {
      this.questionLanguage = lang;
      localStorage.setItem('gcp_pca_question_lang', lang);
      if (lang === 'pt' || lang === 'bi') {
        this.translateVisibleQuestions();
      }
    },

    async translateVisibleQuestions() {
      if (!this.activeQuiz || (this.questionLanguage !== 'pt' && this.questionLanguage !== 'bi')) return;
      
      const q = this.currentQuestion;
      if (q) {
        await getQuestionTranslations(q);
      }
      
      // Prefetch next 2 questions
      for (let i = this.currentQuestionIndex + 1; i <= this.currentQuestionIndex + 2; i++) {
        const nextQ = this.activeQuiz.questions[i];
        if (nextQ && (!nextQ._translations || !nextQ._translations.pt)) {
          getQuestionTranslations(nextQ).catch(() => {});
        }
      }
    },

    // Authenticated API Fetch
    async authFetch(url, options = {}) {
      const headers = { ...(options.headers || {}) };
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        this.logout('Sessão expirada. Por favor, autentique-se novamente.');
      }
      return response;
    },

    // Auth Actions
    async initAuth() {
      await this.fetchAuthConfig();
      if (this.authToken) {
        try {
          const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: this.authToken })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              this.currentUser = data.user;
              localStorage.setItem('gcp_pca_user_profile', JSON.stringify(data.user));
              return;
            }
          } else {
            this.logout('Sessão expirada.');
          }
        } catch (e) {
          console.warn('[Store Auth] Aviso ao verificar sessão anterior:', e.message);
        }
      }
    },

    async fetchAuthConfig() {
      try {
        const res = await fetch('/api/auth/config');
        if (res.ok) {
          const data = await res.json();
          if (data.clientId) this.googleClientId = data.clientId;
          return data.clientId;
        }
      } catch (e) {
        console.warn('[Store Auth] Erro ao buscar client ID:', e.message);
      }
      return null;
    },

    async loginWithGoogle(credential) {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        this.setAuthUser(credential, data.user);
        return { success: true, user: data.user };
      }
      throw new Error(data.message || 'Falha na validação com o Google.');
    },

    async devLogin() {
      try {
        const res = await fetch('/api/auth/dev-login', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.success) {
          this.setAuthUser(data.token, data.user);
          return { success: true, user: data.user };
        }
      } catch (e) {
        console.warn('[Store Auth] Dev login offline fallback:', e.message);
      }
      const mockDev = {
        userId: 'dev-user-local',
        email: 'dev@local.internal',
        name: 'Desenvolvedor (Local)',
        picture: null
      };
      this.setAuthUser('dev_token_local', mockDev);
      return { success: true, user: mockDev };
    },

    setAuthUser(token, user) {
      this.authToken = token;
      this.currentUser = user;
      localStorage.setItem('gcp_pca_auth_token', token);
      localStorage.setItem('gcp_pca_user_profile', JSON.stringify(user));
      this.currentScreen = 'dashboard';
      this.fetchProgress(); // Load saved progress after login
    },

    logout(msg) {
      this.authToken = null;
      this.currentUser = null;
      localStorage.removeItem('gcp_pca_auth_token');
      localStorage.removeItem('gcp_pca_user_profile');
      this.currentScreen = 'login';
    },

    async fetchProgress() {
      try {
        const res = await this.authFetch(`/api/progress?examId=${encodeURIComponent(this.activeExamId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.progress) {
            this.savedProgressMap = data.progress;
          }
        }
      } catch (e) {
        console.warn('[Store] Erro ao carregar progresso:', e.message);
      }
    },

    // Multi-Exam Actions
    async fetchExams() {
      return this.fetchExamsCatalog();
    },

    async fetchQuizzes(examId) {
      return this.loadQuizCatalog(examId);
    },

    async fetchExamsCatalog() {
      try {
        const res = await fetch('/api/exams');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.exams)) {
            this.examsCatalog = data.exams;
          }
        }
      } catch (e) {
        console.warn('[Store Exams] Erro ao carregar catálogo de exames:', e.message);
      }
    },

    async selectExam(examId) {
      if (this.activeExamId === examId) {
        this.isExamDrawerOpen = false;
        return;
      }
      this.activeExamId = examId;
      localStorage.setItem('gcp_active_exam', examId);
      this.isExamDrawerOpen = false;
      await this.loadQuizCatalog(examId);
      await this.fetchProgress();
    },

    // Quiz Catalog
    async loadQuizCatalog(examId) {
      const targetExam = examId || this.activeExamId || 'gcp-pca';
      try {
        const res = await this.authFetch(`/api/quizzes?examId=${encodeURIComponent(targetExam)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.quizzes) {
            this.quizDatabase = {
              examId: data.examId || targetExam,
              examTitle: data.examTitle,
              status: data.status || 'active',
              totalQuizzes: data.totalQuizzes,
              totalQuestions: data.totalQuestions,
              sections: data.sections,
              quizzes: data.quizzes
            };
          }
        }
      } catch (e) {
        console.warn('[Store Quizzes] Erro ao carregar catálogo de simulados:', e.message);
      }
    },

    // Start Simulation
    async startQuiz(quizId, resumeSaved = false) {
      let quiz = this.quizDatabase?.quizzes?.find(q => String(q.id) === String(quizId));
      if (!quiz) {
        // Fallback se o catálogo não foi carregado corretamente na tela
        quiz = { id: parseInt(quizId, 10), title: `Simulado ${quizId}`, questions: [] };
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        try {
          const res = await this.authFetch(`/api/quizzes/${quizId}?examId=${encodeURIComponent(this.activeExamId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.quiz?.questions) {
              quiz.questions = data.quiz.questions;
            }
          }
        } catch (e) {
          console.warn('[Store] Falha ao carregar perguntas do quiz:', e.message);
        }
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        throw new Error('Não foi possível carregar as questões deste simulado.');
      }

      this.activeQuiz = quiz;
      this.currentQuestionIndex = 0;
      this.userAnswers = {};
      this.flaggedQuestions = {};
      this.revealedExplanations = {};
      this.timeElapsed = 0;

      // Resume saved state for Simulado
      if (resumeSaved && this.selectedMode === 'simulado') {
        let parsed = null;

        // 1. Tenta carregar do backend para ser a fonte mais atualizada
        try {
          const res = await this.authFetch(`/api/progress/${quizId}?examId=${encodeURIComponent(this.activeExamId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.exists && data.data) {
              parsed = data.data;
            }
          }
        } catch (e) {
          console.warn('[Store] Falha ao buscar progresso detalhado do servidor:', e.message);
        }

        // 2. Fallback para memória local (store) se o backend falhar
        if (!parsed && this.savedProgressMap && this.savedProgressMap[quizId]) {
          parsed = this.savedProgressMap[quizId];
        }

        // 3. Fallback para localStorage
        if (!parsed) {
          const key = `${this.activeExamId}_saved_simulado_${quizId}`;
          const raw = localStorage.getItem(key) || (this.activeExamId === 'gcp-pca' ? localStorage.getItem(`gcp_pca_saved_simulado_${quizId}`) : null);
          if (raw) {
            try {
              parsed = JSON.parse(raw);
            } catch (e) {}
          }
        }

        if (parsed) {
          this.userAnswers = parsed.userAnswers || {};
          this.flaggedQuestions = parsed.flaggedQuestions || {};
          this.currentQuestionIndex = parsed.currentQuestionIndex || 0;
          this.timeElapsed = parsed.timeElapsed || 0;
          
          // Sincroniza o localStorage e map local para ficar atualizado
          const key = `${this.activeExamId}_saved_simulado_${quizId}`;
          localStorage.setItem(key, JSON.stringify(parsed));
          this.savedProgressMap[quizId] = parsed;
        }
      }

      // Configure Timer
      this.stopTimer();
      if (this.selectedMode === 'exame') {
        this.timeRemaining = 120 * 60;
        this.startTimer(true);
      } else {
        this.startTimer(false);
      }

      this.currentScreen = 'quiz';
      
      if (this.questionLanguage === 'pt' || this.questionLanguage === 'bi') {
        this.translateVisibleQuestions();
      }
    },

    // Option selection
    selectOption(letter) {
      const q = this.currentQuestion;
      if (!q) return;

      let current = this.userAnswers[q.id] ? [...this.userAnswers[q.id]] : [];
      if (q.selectCount === 1) {
        this.userAnswers[q.id] = [letter];
      } else {
        if (current.includes(letter)) {
          current = current.filter(l => l !== letter);
        } else {
          if (current.length < q.selectCount) {
            current.push(letter);
          } else {
            current.shift();
            current.push(letter);
          }
        }
        this.userAnswers[q.id] = current;
      }

      if (this.selectedMode === 'simulado') {
        this.saveProgress();
      }
    },

    toggleFlag() {
      const q = this.currentQuestion;
      if (!q) return;
      if (this.flaggedQuestions[q.id]) {
        delete this.flaggedQuestions[q.id];
      } else {
        this.flaggedQuestions[q.id] = true;
      }
      if (this.selectedMode === 'simulado') {
        this.saveProgress();
      }
    },

    revealExplanation() {
      const q = this.currentQuestion;
      if (!q) return;
      this.revealedExplanations[q.id] = !this.revealedExplanations[q.id];
    },

    goToQuestion(idx) {
      if (idx >= 0 && idx < this.totalQuestions) {
        this.currentQuestionIndex = idx;
        this.isMobileNavDrawerOpen = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.questionLanguage === 'pt' || this.questionLanguage === 'bi') this.translateVisibleQuestions();
      }
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.currentQuestionIndex++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.selectedMode === 'simulado') this.saveProgress();
        if (this.questionLanguage === 'pt' || this.questionLanguage === 'bi') this.translateVisibleQuestions();
      }
    },

    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (this.selectedMode === 'simulado') this.saveProgress();
        if (this.questionLanguage === 'pt' || this.questionLanguage === 'bi') this.translateVisibleQuestions();
      }
    },

    // Timer logic
    startTimer(isCountdown) {
      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        if (isCountdown) {
          if (this.timeRemaining > 0) {
            this.timeRemaining--;
          } else {
            this.finishQuiz();
          }
        } else {
          this.timeElapsed++;
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.isTimerRunning = false;
    },

    // Save Progress
    async saveProgress() {
      if (this.selectedMode !== 'simulado' || !this.activeQuiz) return;
      const saveState = {
        examId: this.activeExamId,
        quizId: this.activeQuiz.id,
        quizTitle: this.activeQuiz.title,
        userAnswers: this.userAnswers,
        flaggedQuestions: this.flaggedQuestions,
        revealedExplanations: this.revealedExplanations,
        currentQuestionIndex: this.currentQuestionIndex,
        timeElapsed: this.timeElapsed,
        savedAt: new Date().toISOString()
      };
      const key = `${this.activeExamId}_saved_simulado_${this.activeQuiz.id}`;
      localStorage.setItem(key, JSON.stringify(saveState));
      this.savedProgressMap[this.activeQuiz.id] = saveState;


      try {
        await this.authFetch(`/api/progress/${this.activeQuiz.id}?examId=${encodeURIComponent(this.activeExamId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveState)
        });
      } catch (e) {}
    },

    async clearSavedProgress(quizId) {
      localStorage.removeItem(`${this.activeExamId}_saved_simulado_${quizId}`);
      localStorage.removeItem(`gcp_pca_saved_simulado_${quizId}`);
      delete this.savedProgressMap[quizId];
      try {
        await this.authFetch(`/api/progress/${quizId}?examId=${encodeURIComponent(this.activeExamId)}`, { method: 'DELETE' });
      } catch (e) {}
    },

    // Finish & Results
    async finishQuiz() {
      this.stopTimer();
      const totalQ = this.totalQuestions;
      let correct = 0;
      let wrong = 0;
      let unanswered = 0;

      const sectionStats = {};
      const sections = this.quizDatabase?.sections || {};
      Object.keys(sections).forEach(k => {
        sectionStats[k] = { total: 0, correct: 0 };
      });

      const questionResults = this.activeQuiz.questions.map(q => {
        const userAns = this.userAnswers[q.id] || [];
        const secId = q.sectionId || '1';
        if (!sectionStats[secId]) sectionStats[secId] = { total: 0, correct: 0 };
        sectionStats[secId].total++;

        const isUnanswered = userAns.length === 0;
        let isCorrect = false;

        if (isUnanswered) {
          unanswered++;
        } else {
          const sortedUser = [...userAns].sort().join(',');
          const sortedAns = [...q.answers].sort().join(',');
          isCorrect = sortedUser === sortedAns;
          if (isCorrect) {
            correct++;
            sectionStats[secId].correct++;
          } else {
            wrong++;
          }
        }

        return {
          question: q,
          userAnswers: userAns,
          isCorrect,
          isUnanswered
        };
      });

      const scorePct = Math.round((correct / totalQ) * 100);
      const isPassed = scorePct >= 70;

      this.lastResults = {
        quizTitle: this.activeQuiz.title,
        mode: this.selectedMode,
        totalQuestions: totalQ,
        correctCount: correct,
        wrongCount: wrong,
        unansweredCount: unanswered,
        scorePct,
        isPassed,
        timeElapsed: this.timeElapsed,
        sectionStats,
        questionResults
      };

      // Discard saved progress
      if (this.selectedMode === 'simulado') {
        await this.clearSavedProgress(this.activeQuiz.id);
      }

      // Save to Cloud Firestore
      try {
        await this.authFetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examId: this.activeExamId,
            quizId: this.activeQuiz.id,
            quizTitle: this.activeQuiz.title,
            mode: this.selectedMode,
            scorePercentage: scorePct,
            correctCount: correct,
            wrongCount: wrong,
            unansweredCount: unanswered,
            totalQuestions: totalQ,
            timeElapsed: this.timeElapsed,
            breakdown: sectionStats
          })
        });
      } catch (e) {}

      this.currentScreen = 'results';
    }
  }
});
