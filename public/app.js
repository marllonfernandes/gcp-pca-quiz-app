/**
 * Google Cloud Professional Cloud Architect (PCA) Practice Platform
 * Full interactive simulation engine with Exam & Simulado modes,
 * plus comprehensive English & Portuguese bilingual support.
 */

(function () {
  'use strict';

  // Modern SVG Icons for high-fidelity UI
  const UI_ICONS = {
    clock: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    hourglass: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
    sun: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    save: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    lightbulb: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    book: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
    ban: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`,
    lock: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    chart: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    play: `<svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
    flagOutline: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    flagFilled: `<svg class="ui-icon text-warning" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15" stroke-width="2"/></svg>`,
    check: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    checkCircle: `<svg class="ui-icon text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    xCircle: `<svg class="ui-icon text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`,
    alertTriangle: `<svg class="ui-icon text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    info: `<svg class="ui-icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>`,
    refresh: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
    document: `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    flagBR: `<svg class="flag-icon" viewBox="0 0 640 480" width="16" height="12"><path fill="#009c3b" d="M0 0h640v480H0z"/><path fill="#ffdf00" d="m320 40 280 200-280 200L40 240z"/><circle cx="320" cy="240" r="100" fill="#002776"/></svg>`
  };

  // I18N UI Dictionary
  const I18N = {
    pt: {
      appTitle: "GCP Cloud Architect",
      appSubtitle: "Plataforma Independente de Preparação (PCA)",
      modeSimuladoBadge: "MODO SIMULADO",
      modeExameBadge: "MODO EXAME (120 min)",
      heroTitle: "Simulados Preparatórios para GCP Professional Cloud Architect",
      heroSubtitle: "Banco de 420 questões práticas comentadas, com distribuição percentual e pesos alinhados ao Guia do Exame Google Cloud Professional Cloud Architect.",
      badge7Quizzes: "7 Simulados Completos",
      badge60Q: "60 Questões por Simulado",
      badge420Q: "420 Questões no Total",
      badgeSecDist: "Alinhado aos Domínios do Exame",
      badge120Min: "Temporizador Simulado (120 min)",
      step1Title: "1. Escolha a Modalidade de Realização",
      modeStudyBadge: "Modo Estudo",
      modeStudyTitle: "Modo Simulado (Treinamento)",
      modeStudyDesc: "Ideal para estudo diário, revisão ativa e aprendizado contínuo.",
      modeStudyF1: `${UI_ICONS.save} <strong>Salva progresso:</strong> Pause e retome a qualquer momento.`,
      modeStudyF2: `${UI_ICONS.lightbulb} <strong>Dicas ativadas:</strong> Obtenha pistas de arquitetura quando tiver dúvida.`,
      modeStudyF3: `${UI_ICONS.book} <strong>Feedback imediato:</strong> Opção de ver o gabarito e explicação na hora.`,
      modeStudyF4: `${UI_ICONS.clock} <strong>Sem pressão de tempo:</strong> Cronômetro progressivo opcional.`,
      modeExamBadge: "Modo Real",
      modeExamTitle: "Modo Exame (Certificação)",
      modeExamDesc: "Simulação realista baseada no formato do exame de certificação Google Cloud.",
      modeExamF1: `${UI_ICONS.hourglass} <strong>Temporizador de 120 minutos:</strong> Contagem regressiva rígida.`,
      modeExamF2: `${UI_ICONS.ban} <strong>Não salva progresso:</strong> Não permite pausar ou continuar depois.`,
      modeExamF3: `${UI_ICONS.lock} <strong>Sem dicas:</strong> Feedback e justificativas exibidos apenas no final.`,
      modeExamF4: `${UI_ICONS.chart} <strong>Critério de Referência:</strong> Meta recomendada de 70% para aprovação.`,
      step2Title: "2. Escolha o Quiz (60 Questões)",
      btnContinue: `${UI_ICONS.play} Continuar`,
      btnRestart: "Reiniciar",
      btnStart: "Iniciar Simulado",
      savedProgress: `${UI_ICONS.save} Progresso salvo:`,
      discardSaved: "Descartar",
      confirmDiscard: "Deseja descartar o progresso salvo deste simulado?",
      flagReview: `${UI_ICONS.flagOutline} Marcar para Revisar`,
      flaggedReview: `${UI_ICONS.flagFilled} Marcada para Revisar`,
      hintBtn: `${UI_ICONS.lightbulb} Ver Dica Arquitetural`,
      hintTitle: "Dica Arquitetural:",
      explanationTitle: `${UI_ICONS.book} Gabarito e Justificativa`,
      officialAnswer: "Gabarito Comentado:",
      btnPrev: "← Anterior",
      btnNext: "Próxima →",
      btnReveal: "Ver Gabarito",
      btnHideReveal: "Ocultar Gabarito",
      btnSaveExit: "Salvar & Sair",
      btnAbandonExam: "Abandonar Exame",
      btnFinish: `${UI_ICONS.check} Finalizar Simulado`,
      navTitle: "Navegação",
      navAnswered: "Respondida",
      navUnanswered: "Não respondida",
      navFlagged: `Marcada para Revisar (${UI_ICONS.flagFilled})`,
      passedBadge: "APROVADO",
      failedBadge: "PRECISA DE REVISÃO",
      targetGoal: "Meta de Aprovação: 70%",
      statTotal: "Total de Questões",
      statCorrect: "Acertos",
      statWrong: "Erros",
      statUnanswered: "Em Branco",
      sectionBreakdownTitle: `${UI_ICONS.chart} Desempenho por Domínio do Guia de Exame (PCA)`,
      sectionBreakdownDesc: "Distribuição ponderada de acordo com as 6 seções do Guia do Exame Professional Cloud Architect.",
      btnRetake: `${UI_ICONS.refresh} Refazer este Simulado`,
      btnSelectOther: `${UI_ICONS.document} Selecionar Outro Quiz`,
      reviewTitle: "Revisão Detalhada das Questões",
      filterAll: "Todas",
      filterWrong: "Apenas Erradas",
      filterCorrect: "Apenas Acertos",
      filterUnanswered: "Em Branco",
      yourAnswer: "Sua Resposta:",
      correctAnswer: "Resposta Correta:",
      statusCorrect: `${UI_ICONS.checkCircle} (Correta)`,
      statusWrong: `${UI_ICONS.xCircle} (Incorreta)`,
      officialExplanation: `${UI_ICONS.book} Explicação Arquitetural Detalhada`,
      select1: "Escolha 1 opção",
      selectN: "Selecione {n} opções",
      translating: "Traduzindo para Português...",
      footerBrand: "<strong>PCA Architect Prep</strong> — Plataforma Independente de Treinamento",
      footerDisclaimer: "<strong>Aviso Legal & Marcas Registradas:</strong> Google Cloud, GCP e Google Cloud Certified Professional Cloud Architect são marcas comerciais ou registradas da Google LLC. Este aplicativo é uma ferramenta preparatória independente desenvolvida para fins educacionais e de estudo. NÃO possui afiliação, patrocínio, autorização ou endosso oficial por parte da Google LLC. As inscrições para os exames oficiais devem ser realizadas nos canais credenciados pelo Google Cloud.",
      footerLegalNotice: "Aviso Legal & Marcas",
      footerTerms: "Termos de Uso",
      footerPrivacy: "Política de Privacidade",
      footerExamGuideLink: "Guia de Exame (Google Cloud) ↗",
      footerCopyright: "&copy; 2026 PCA Architect Prep. Material preparatório independente.",
      legalModalTitle: "Aviso Legal & Conformidade"
    },
    en: {
      appTitle: "GCP Cloud Architect",
      appSubtitle: "Independent Practice Exams & Simulator (PCA)",
      modeSimuladoBadge: "PRACTICE MODE",
      modeExameBadge: "EXAM MODE (120 min)",
      heroTitle: "Preparation Practice Exams for GCP Professional Cloud Architect",
      heroSubtitle: "Bank of 420 commented practice questions, weighted and mapped to the Google Cloud Professional Cloud Architect blueprint.",
      badge7Quizzes: "7 Full Practice Exams",
      badge60Q: "60 Questions per Exam",
      badge420Q: "420 Questions Total",
      badgeSecDist: "Exam Domain Distribution",
      badge120Min: "120-min Timed Simulator",
      step1Title: "1. Select Exam Mode",
      modeStudyBadge: "Study Mode",
      modeStudyTitle: "Practice Mode (Training)",
      modeStudyDesc: "Ideal for daily study, active recall, and continuous learning.",
      modeStudyF1: `${UI_ICONS.save} <strong>Save progress:</strong> Pause and resume at any time.`,
      modeStudyF2: `${UI_ICONS.lightbulb} <strong>Hints enabled:</strong> Get architectural clues when in doubt.`,
      modeStudyF3: `${UI_ICONS.book} <strong>Immediate feedback:</strong> Reveal answer key and detailed explanations.`,
      modeStudyF4: `${UI_ICONS.clock} <strong>No time pressure:</strong> Optional forward stopwatch.`,
      modeExamBadge: "Real Exam",
      modeExamTitle: "Exam Mode (Certification Simulation)",
      modeExamDesc: "Realistic simulation based on the Google Cloud certification exam format.",
      modeExamF1: `${UI_ICONS.hourglass} <strong>120-Minute Timer:</strong> Strict countdown clock.`,
      modeExamF2: `${UI_ICONS.ban} <strong>No saving:</strong> Cannot pause and resume later.`,
      modeExamF3: `${UI_ICONS.lock} <strong>No hints:</strong> Answers and explanations only shown upon completion.`,
      modeExamF4: `${UI_ICONS.chart} <strong>Exam Benchmark:</strong> 70% recommended target score.`,
      step2Title: "2. Select Quiz (60 Questions)",
      btnContinue: `${UI_ICONS.play} Resume`,
      btnRestart: "Restart",
      btnStart: "Start Exam",
      savedProgress: `${UI_ICONS.save} Saved progress:`,
      discardSaved: "Discard",
      confirmDiscard: "Do you want to discard saved progress for this exam?",
      flagReview: `${UI_ICONS.flagOutline} Mark for Review`,
      flaggedReview: `${UI_ICONS.flagFilled} Marked for Review`,
      hintBtn: `${UI_ICONS.lightbulb} View Architectural Hint`,
      hintTitle: "Architectural Hint:",
      explanationTitle: `${UI_ICONS.book} Answer & Explanation`,
      officialAnswer: "Answer Key & Rationale:",
      btnPrev: "← Previous",
      btnNext: "Next →",
      btnReveal: "Show Answer",
      btnHideReveal: "Hide Answer",
      btnSaveExit: "Save & Exit",
      btnAbandonExam: "Abandon Exam",
      btnFinish: `${UI_ICONS.check} Submit Exam`,
      navTitle: "Navigation",
      navAnswered: "Answered",
      navUnanswered: "Unanswered",
      navFlagged: `Marked for Review (${UI_ICONS.flagFilled})`,
      passedBadge: "PASSED",
      failedBadge: "NEEDS REVIEW",
      targetGoal: "Passing Target: 70%",
      statTotal: "Total Questions",
      statCorrect: "Correct",
      statWrong: "Incorrect",
      statUnanswered: "Unanswered",
      sectionBreakdownTitle: `${UI_ICONS.chart} Performance by Exam Blueprint Domain`,
      sectionBreakdownDesc: "Weighted distribution mapped to the 6 domains of the Google Cloud Professional Cloud Architect blueprint.",
      btnRetake: `${UI_ICONS.refresh} Retake This Quiz`,
      btnSelectOther: `${UI_ICONS.document} Choose Another Quiz`,
      reviewTitle: "Detailed Question Review",
      filterAll: "All",
      filterWrong: "Incorrect Only",
      filterCorrect: "Correct Only",
      filterUnanswered: "Unanswered",
      yourAnswer: "Your Answer:",
      correctAnswer: "Correct Answer:",
      statusCorrect: `${UI_ICONS.checkCircle} (Correct)`,
      statusWrong: `${UI_ICONS.xCircle} (Incorrect)`,
      officialExplanation: `${UI_ICONS.book} Detailed Architectural Rationale`,
      select1: "Choose 1 option",
      selectN: "Select {n} options",
      translating: "Translating to Portuguese...",
      footerBrand: "<strong>PCA Architect Prep</strong> — Independent Practice & Training Platform",
      footerDisclaimer: "<strong>Legal Disclaimer & Trademarks:</strong> Google Cloud, GCP, and Google Cloud Certified Professional Cloud Architect are trademarks or registered trademarks of Google LLC. This platform is an independent preparatory study tool designed solely for educational purposes. It is NOT affiliated with, sponsored by, authorized by, or endorsed by Google LLC. Official certification exam registrations must be made directly through Google Cloud testing partners.",
      footerLegalNotice: "Legal Notice & Trademarks",
      footerTerms: "Terms of Service",
      footerPrivacy: "Privacy Policy",
      footerExamGuideLink: "Exam Guide (Google Cloud) ↗",
      footerCopyright: "&copy; 2026 PCA Architect Prep. Independent preparatory study platform.",
      legalModalTitle: "Legal Notice & Compliance"
    }
  };

  // State Variables
  let quizDatabase = null;
  let activeQuiz = null;
  let selectedMode = 'simulado'; // 'simulado' | 'exame'
  let uiLanguage = localStorage.getItem('gcp_pca_ui_lang') || 'pt'; // 'pt' | 'en'
  let questionLanguage = localStorage.getItem('gcp_pca_question_lang') || 'pt'; // 'en' | 'pt' | 'bilingual'
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { [questionId]: ['A', 'C'] }
  let flaggedQuestions = {}; // { [questionId]: true }
  let revealedExplanations = {}; // { [questionId]: true } (for study mode)
  let timerInterval = null;
  let timeRemaining = 120 * 60; // 120 minutes in seconds
  let timeElapsed = 0;
  let isTimerRunning = false;

  // Translation Cache
  const TRANS_CACHE_KEY = 'gcp_pca_trans_cache_v2';
  let translationCache = {};
  try {
    translationCache = JSON.parse(localStorage.getItem(TRANS_CACHE_KEY) || '{}');
  } catch (e) {
    translationCache = {};
  }

  // Auth State
  let authToken = localStorage.getItem('gcp_pca_auth_token') || null;
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('gcp_pca_user_profile') || 'null');
  } catch (e) {
    currentUser = null;
  }
  let googleClientId = null;

  // DOM Elements
  const screenLogin = document.getElementById('screen-login');
  const screenDashboard = document.getElementById('screen-dashboard');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResults = document.getElementById('screen-results');

  const userProfileBadge = document.getElementById('user-profile-badge');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const btnLogout = document.getElementById('btn-logout');
  const googleBtnSlot = document.getElementById('google-btn-slot');
  const loginSpinner = document.getElementById('login-spinner');

  const quizGridContainer = document.getElementById('quizzes-grid');
  const timerBadge = document.getElementById('timer-badge');
  const timerDisplay = document.getElementById('timer-display');
  const modeHeaderBadge = document.getElementById('mode-header-badge');
  const themeToggleBtn = document.getElementById('btn-toggle-theme');

  // Authenticated Fetch Wrapper
  async function authFetch(url, options = {}) {
    const headers = Object.assign({}, options.headers || {});
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const config = Object.assign({}, options, { headers });
    const response = await fetch(url, config);
    if (response.status === 401) {
      console.warn('[Auth] Requisição não autorizada (401), efetuando logout...');
      handleLogout(uiLanguage === 'pt' ? 'Sua sessão expirou. Faça login novamente com o Google.' : 'Session expired. Please log in again with Google.');
    }
    return response;
  }

  // Quiz Screen Elements
  const quizTitleEl = document.getElementById('quiz-title');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizProgressBarFill = document.getElementById('quiz-progress-bar-fill');
  const questionIndexEl = document.getElementById('question-index');
  const questionSectionTag = document.getElementById('question-section-tag');
  const questionCaseStudyTag = document.getElementById('question-case-study-tag');
  const questionSelectCountTag = document.getElementById('question-select-count-tag');
  const questionTextEl = document.getElementById('question-text');
  const optionsListEl = document.getElementById('options-list');
  const flagBtn = document.getElementById('btn-flag-question');
  const hintToggleBtn = document.getElementById('btn-hint-toggle');
  const hintBox = document.getElementById('hint-box');
  const hintContent = document.getElementById('hint-content');
  const explanationBox = document.getElementById('explanation-box');
  const explanationContent = document.getElementById('explanation-content');
  const revealAnswerBtn = document.getElementById('btn-reveal-answer');
  const questionsGridNav = document.getElementById('questions-grid-nav');

  // Nav Buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFinish = document.getElementById('btn-finish');
  const btnSaveExit = document.getElementById('btn-save-exit');

  // Mobile Bottom Sheet Elements
  const btnOpenGridMobile = document.getElementById('btn-open-grid-mobile');
  const btnQuickGrid = document.getElementById('btn-quick-grid');
  const quickGridText = document.getElementById('quick-grid-text');
  const quizSidebar = document.getElementById('quiz-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const btnCloseSidebar = document.getElementById('btn-close-sidebar');

  function openMobileSidebar() {
    if (quizSidebar) quizSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (quizSidebar) quizSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toast Notification Container
  const toastContainer = document.getElementById('toast-container');

  // Confirmation Modal
  const modalConfirm = document.getElementById('modal-confirm');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalBtnCancel = document.getElementById('modal-btn-cancel');
  const modalBtnConfirm = document.getElementById('modal-btn-confirm');
  let modalConfirmCallback = null;

  // Modern Toast Notification (PrimeVue inspired)
  function showToast({ type = 'info', title = '', message = '', duration = 3500 }) {
    if (!toastContainer) return;

    const icons = {
      success: UI_ICONS.checkCircle,
      info: UI_ICONS.info,
      warning: UI_ICONS.alertTriangle,
      error: UI_ICONS.xCircle
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || UI_ICONS.info}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close-btn" aria-label="Fechar">&times;</button>
      <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    let dismissTimeout = null;

    const dismissToast = () => {
      if (dismissTimeout) clearTimeout(dismissTimeout);
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    };

    closeBtn.addEventListener('click', dismissToast);
    dismissTimeout = setTimeout(dismissToast, duration);

    toastContainer.appendChild(toast);
  }

  // CloudStorage - Firestore Native Backend Integration (Database: certificacao)
  // CloudStorage - Firestore Native Backend Integration (Database: certificacao)
  const CloudStorage = {
    isAvailable: false,
    firestoreInfo: null,
    cloudProgress: {},

    isFirestoreActive() {
      return Boolean(this.firestoreInfo && this.firestoreInfo.active);
    },

    async init() {
      try {
        const res = await authFetch('/api/status', { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          this.isAvailable = data.status === 'ok';
          this.firestoreInfo = data.firestore;
          this.updateBadge();

          if (this.isFirestoreActive() && authToken) {
            await this.syncCloudProgressToLocal();
          }
        } else {
          this.updateBadge();
        }
      } catch (e) {
        this.isAvailable = false;
        this.updateBadge();
      }
    },

    updateBadge() {
      const badge = document.getElementById('cloud-status-badge');
      if (!badge) return;

      if (this.isFirestoreActive()) {
        const dbName = this.firestoreInfo.databaseId || 'certificacao';
        badge.className = 'cloud-status-badge connected';
        badge.innerHTML = `<span class="dot"></span> Firestore: ${dbName}`;
        badge.title = `Conectado ao Firestore Enterprise: ${dbName} (${this.firestoreInfo.region || 'southamerica-east1'})`;
      } else {
        badge.className = 'cloud-status-badge';
        badge.innerHTML = `<span class="dot" style="background:#9aa0a6;"></span> ${UI_ICONS.save} Local`;
        badge.title = 'Armazenamento local no navegador (Offline)';
      }
    },

    async syncCloudProgressToLocal() {
      if (!authToken) return;
      try {
        const res = await authFetch('/api/progress');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.progress) {
            this.cloudProgress = result.progress;
            for (const [quizId, info] of Object.entries(result.progress)) {
              const localKey = `gcp_pca_saved_simulado_${quizId}`;
              const localRaw = localStorage.getItem(localKey);
              if (!localRaw) {
                const docRes = await authFetch(`/api/progress/${quizId}`);
                if (docRes.ok) {
                  const docData = await docRes.json();
                  if (docData.exists && docData.data) {
                    localStorage.setItem(localKey, JSON.stringify(docData.data));
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('[CloudStorage] sync error:', err.message);
      }
    },

    async saveProgress(quizId, data) {
      if (!this.isFirestoreActive() || !authToken) return false;
      try {
        const res = await authFetch(`/api/progress/${quizId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const json = await res.json();
          return json.success;
        }
      } catch (err) {
        console.warn('[CloudStorage] saveProgress error:', err.message);
      }
      return false;
    },

    async deleteProgress(quizId) {
      if (!this.isFirestoreActive() || !authToken) return;
      try {
        await authFetch(`/api/progress/${quizId}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('[CloudStorage] deleteProgress error:', err.message);
      }
    },

    async saveExamResult(resultData) {
      if (!this.isFirestoreActive() || !authToken) return;
      try {
        await authFetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultData)
        });
      } catch (err) {
        console.warn('[CloudStorage] saveExamResult error:', err.message);
      }
    }
  };

  // Google Authentication Handlers
  async function fetchGoogleClientId() {
    try {
      const res = await fetch('/api/auth/config');
      if (res.ok) {
        const data = await res.json();
        if (data.clientId) {
          googleClientId = data.clientId;
        }
      }
    } catch (e) {
      console.warn('[Auth] Não foi possível obter Client ID da API, usando padrão:', e.message);
    }
  }

  function updateProfileUI() {
    if (currentUser) {
      if (userAvatar) {
        userAvatar.src = currentUser.picture || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
      }
      if (userName) {
        userName.textContent = currentUser.name || currentUser.email || 'Usuário';
      }
      if (userProfileBadge) {
        userProfileBadge.style.display = 'inline-flex';
      }
    } else {
      if (userProfileBadge) {
        userProfileBadge.style.display = 'none';
      }
    }
  }

  async function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) {
      showToast({
        type: 'error',
        title: 'Erro de Login',
        message: 'Não foi possível obter a credencial do Google.',
        duration: 4000
      });
      return;
    }

    if (loginSpinner) loginSpinner.style.display = 'flex';
    if (googleBtnSlot) googleBtnSlot.style.display = 'none';

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        authToken = response.credential;
        currentUser = data.user;
        localStorage.setItem('gcp_pca_auth_token', authToken);
        localStorage.setItem('gcp_pca_user_profile', JSON.stringify(currentUser));

        updateProfileUI();

        // Carrega catálogo e sincroniza Firestore do usuário autenticado
        await loadQuizData();
        await CloudStorage.init();
        renderDashboard();

        switchScreen(screenDashboard);

        showToast({
          type: 'success',
          title: uiLanguage === 'pt' ? 'Login Realizado' : 'Signed In',
          message: uiLanguage === 'pt'
            ? `Bem-vindo(a), ${currentUser.name}! Acesso liberado.`
            : `Welcome, ${currentUser.name}! Access granted.`,
          duration: 4000
        });
      } else {
        throw new Error(data.message || 'Falha ao validar credencial');
      }
    } catch (err) {
      console.error('[Auth Verify] Erro:', err);
      showToast({
        type: 'error',
        title: 'Falha no Login',
        message: err.message || 'Erro ao comunicar com o servidor de autenticação.',
        duration: 5000
      });
      if (googleBtnSlot) googleBtnSlot.style.display = 'flex';
    } finally {
      if (loginSpinner) loginSpinner.style.display = 'none';
    }
  }

  let isGsiInitialized = false;

  function renderGoogleButton() {
    if (!googleBtnSlot) return;

    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
      setTimeout(renderGoogleButton, 200);
      return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    try {
      if (!isGsiInitialized) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        isGsiInitialized = true;
      }

      googleBtnSlot.innerHTML = '';
      google.accounts.id.renderButton(googleBtnSlot, {
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
        width: 280
      });

    } catch (e) {
      console.error('[Google Sign-In] Erro ao renderizar botão:', e);
    }
  }

  function handleLogout(customMessage) {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('gcp_pca_auth_token');
    localStorage.removeItem('gcp_pca_user_profile');

    updateProfileUI();
    switchScreen(screenLogin);

    if (googleBtnSlot) googleBtnSlot.style.display = 'flex';
    if (loginSpinner) loginSpinner.style.display = 'none';
    renderGoogleButton();

    showToast({
      type: 'info',
      title: uiLanguage === 'pt' ? 'Sessão Encerrada' : 'Logged Out',
      message: customMessage || (uiLanguage === 'pt' ? 'Você saiu da sua conta Google.' : 'You have logged out of your Google account.'),
      duration: 3500
    });
  }

  // Initialize
  async function initApp() {
    setupTheme();
    setupLanguageControls();
    setupEventListeners();
    await fetchGoogleClientId();


    const btnDevLogin = document.getElementById('btn-dev-login');
    if (btnDevLogin) {
      btnDevLogin.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/auth/dev-login', { method: 'POST' });
          const data = await res.json();
          if (res.ok && data.success && data.user) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('gcp_pca_auth_token', authToken);
            localStorage.setItem('gcp_pca_user_profile', JSON.stringify(currentUser));

            updateProfileUI();

            await loadQuizData();
            await CloudStorage.init();
            renderDashboard();

            switchScreen(screenDashboard);

            showToast({
              type: 'success',
              title: 'Modo Local Ativado',
              message: 'Conectado em modo de testes local com sucesso!',
              duration: 3500
            });
          }
        } catch (e) {
          showToast({ type: 'error', title: 'Erro', message: e.message });
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        showConfirmModal(
          uiLanguage === 'pt' ? 'Sair da Conta' : 'Sign Out',
          uiLanguage === 'pt' ? 'Deseja encerrar sua sessão atual?' : 'Do you want to sign out?',
          () => handleLogout()
        );
      });
    }

    // Verifica se já há uma sessão salva no navegador
    if (authToken) {
      try {
        const verifyRes = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: authToken })
        });
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.success && verifyData.user) {
            currentUser = verifyData.user;
            localStorage.setItem('gcp_pca_user_profile', JSON.stringify(currentUser));
            updateProfileUI();

            await loadQuizData();
            await CloudStorage.init();
            renderDashboard();
            switchScreen(screenDashboard);
            return;
          }
        }
      } catch (err) {
        console.warn('[Auth Check] Falha ao verificar token existente:', err.message);
      }
      // Se inválido
      localStorage.removeItem('gcp_pca_auth_token');
      authToken = null;
      currentUser = null;
    }

    // Login obrigatório: exibe a tela de login
    updateProfileUI();
    switchScreen(screenLogin);
    renderGoogleButton();
  }

  // Load Data: Attempts to load from Cloud Firestore API, with graceful fallback to local files
  async function loadQuizData() {
    try {
      const response = await authFetch('/api/quizzes');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.quizzes && data.quizzes.length > 0) {
          quizDatabase = {
            examTitle: data.examTitle,
            version: data.version,
            totalQuizzes: data.totalQuizzes,
            totalQuestions: data.totalQuestions,
            sections: data.sections,
            quizzes: data.quizzes
          };
          window.QUIZ_DATA_SOURCE = data.source || 'firestore';
          console.log(`[QuizApp] Catálogo de simulados carregado do Firestore API (${window.QUIZ_DATA_SOURCE})`);
          return;
        }
      }
    } catch (e) {
      console.warn('[QuizApp] Erro ao carregar catálogo da API:', e.message);
      showToast({
        type: 'error',
        title: uiLanguage === 'pt' ? 'Erro de Carregamento' : 'Load Error',
        message: uiLanguage === 'pt' ? 'Não foi possível carregar as questões dos simulados.' : 'Unable to load practice questions database.',
        duration: 5000
      });
    }
  }

  // Translation Service
  async function translateToPortuguese(text) {
    if (!text || !text.trim()) return text;
    const cleanKey = text.trim();
    if (translationCache[cleanKey]) {
      return translationCache[cleanKey];
    }

    // Preserve code blocks with markers
    const codeBlocks = [];
    let textToTranslate = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match) => {
      const idx = codeBlocks.length;
      codeBlocks.push(match);
      return `[[CODE_${idx}]]`;
    });

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(textToTranslate)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Translate fetch error');
      const data = await res.json();
      let translated = '';
      if (data && data[0]) {
        translated = data[0].map(item => item[0]).join('');
      } else {
        translated = text;
      }

      // Restore code blocks
      translated = translated.replace(/\[\[CODE_(\d+)\]\]/g, (m, idx) => {
        return codeBlocks[Number(idx)] || m;
      });

      translationCache[cleanKey] = translated;
      try {
        localStorage.setItem(TRANS_CACHE_KEY, JSON.stringify(translationCache));
      } catch (err) {}

      return translated;
    } catch (e) {
      // Return original English if network fails
      return text;
    }
  }

  async function getQuestionTranslations(question) {
    if (question._translations && question._translations.pt) {
      return question._translations.pt;
    }

    const [transQ, transExp] = await Promise.all([
      translateToPortuguese(question.question),
      translateToPortuguese(question.explanation)
    ]);

    const transOptions = {};
    const sortedLetters = Object.keys(question.options).sort();
    const translatedOpts = await Promise.all(
      sortedLetters.map(letter => translateToPortuguese(question.options[letter]))
    );
    sortedLetters.forEach((letter, i) => {
      transOptions[letter] = translatedOpts[i];
    });

    const ptData = {
      question: transQ,
      options: transOptions,
      explanation: transExp
    };

    question._translations = question._translations || {};
    question._translations.pt = ptData;

    return ptData;
  }

  // Pre-translate upcoming questions in background
  function prefetchNextQuestions(startIndex, count = 2) {
    if (!activeQuiz) return;
    for (let i = startIndex + 1; i <= startIndex + count && i < activeQuiz.questions.length; i++) {
      const nextQ = activeQuiz.questions[i];
      if (nextQ && (!nextQ._translations || !nextQ._translations.pt)) {
        getQuestionTranslations(nextQ).catch(() => {});
      }
    }
  }

  // Theme Management
  function setupTheme() {
    const savedTheme = localStorage.getItem('gcp_pca_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('gcp_pca_theme', next);
    updateThemeIcon(next);
    if (screenLogin && screenLogin.classList.contains('active')) {
      renderGoogleButton();
    }
  }

  function updateThemeIcon(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? UI_ICONS.sun : UI_ICONS.moon;
      themeToggleBtn.title = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // Language Controls Setup
  function setupLanguageControls() {
    // Global UI Language Toggle
    const globalLangGroup = document.getElementById('global-lang-group');
    if (globalLangGroup) {
      globalLangGroup.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === uiLanguage) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
          uiLanguage = btn.getAttribute('data-lang');
          localStorage.setItem('gcp_pca_ui_lang', uiLanguage);
          globalLangGroup.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          applyUILanguage();
        });
      });
    }

    // Question Language Mode Toggle
    const questionLangGroup = document.getElementById('question-lang-group');
    if (questionLangGroup) {
      questionLangGroup.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-qlang') === questionLanguage) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
        btn.addEventListener('click', async () => {
          questionLanguage = btn.getAttribute('data-qlang');
          localStorage.setItem('gcp_pca_question_lang', questionLanguage);
          questionLangGroup.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (activeQuiz) {
            renderCurrentQuestion();
          }
        });
      });
    }

    applyUILanguage();
  }

  // Legal & Compliance Content
  const LEGAL_CONTENT = {
    pt: {
      disclaimer: `
        <h4>1. Isenção de Afiliação e Parceria</h4>
        <p>Este aplicativo (<strong>PCA Architect Prep</strong>) é uma plataforma independente de simulados desenvolvida para a capacitação de profissionais que se preparam para a certificação <strong>Google Cloud Certified Professional Cloud Architect</strong>.</p>
        <p><strong>NÃO possuímos qualquer vínculo institucional, representação, afiliação, patrocínio ou endosso por parte da Google LLC ou de qualquer uma de suas afiliadas.</strong></p>
        <h4>2. Marcas Registradas & Uso Nominativo</h4>
        <p>Os termos "Google", "Google Cloud", "GCP", "Google Cloud Platform" e "Professional Cloud Architect", bem como respectivos nomes de serviços e domínios associados, são marcas registradas de titularidade exclusiva da <strong>Google LLC</strong>.</p>
        <p>A citação a estas marcas e seus planos de estudo nesta aplicação dá-se estritamente sob a doutrina de <em>uso nominativo e descritivo (fair use)</em>, visando identificar de forma clara e precisa a certificação abordada nas questões de treino.</p>
        <h4>3. Exames e Inscrições</h4>
        <p>A realização do exame oficial da certificação exige agendamento nos canais autorizados da Google Cloud (Kryterion / Webassessor). Esta aplicação não comercializa nem substitui vouchers oficiais do exame.</p>
      `,
      terms: `
        <h4>1. Aceitação dos Termos</h4>
        <p>Ao utilizar este aplicativo de preparação para o exame PCA, você declara que concorda e adere integralmente a estes Termos de Uso.</p>
        <h4>2. Finalidade Educacional</h4>
        <p>Todo o conteúdo de questões, gabaritos, dicas arquiteturais e justificativas é disponibilizado exclusivamente para fins de autoestudo e aprendizado contínuo. <strong>Não oferecemos garantia de aprovação no exame oficial</strong>, cabendo ao estudante sua dedicação aos estudos teóricos e práticos.</p>
        <h4>3. Propriedade Intelectual</h4>
        <p>O software, sua interface, organização didática e explicações técnicas originais são protegidos pelas leis de propriedade intelectual. É proibida a extração automatizada, cópia em massa ou revenda não autorizada dos materiais.</p>
      `,
      privacy: `
        <h4>1. Conformidade com LGPD e Políticas Google</h4>
        <p>Respeitamos sua privacidade e tratamos dados pessoais em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e com as Políticas de Dados do Usuário dos Serviços de API do Google.</p>
        <h4>2. Dados Coletados via Google Sign-In</h4>
        <p>Ao autenticar-se com sua Conta Google, os únicos dados acessados são os estritamente necessários para a operação do simulador:</p>
        <ul>
          <li><strong>Nome e E-mail:</strong> Para vincular sua conta e exibir sua identificação.</li>
          <li><strong>Foto de Perfil:</strong> Para exibição no painel do usuário.</li>
          <li><strong>ID Google (sub):</strong> Para isolar com segurança seu progresso e notas no banco Firestore.</li>
        </ul>
        <h4>3. Não Compartilhamento</h4>
        <p>Seus dados <strong>não são vendidos, alugados ou compartilhados</strong> com empresas parceiras de publicidade ou terceiros.</p>
      `
    },
    en: {
      disclaimer: `
        <h4>1. Non-Affiliation Disclaimer</h4>
        <p>This application (<strong>PCA Architect Prep</strong>) is an independent practice exam platform built to help professionals prepare for the <strong>Google Cloud Certified Professional Cloud Architect</strong> examination.</p>
        <p><strong>We have NO institutional partnership, affiliation, sponsorship, authorization, or endorsement by Google LLC or any of its subsidiaries.</strong></p>
        <h4>2. Trademarks & Nominative Fair Use</h4>
        <p>"Google", "Google Cloud", "GCP", "Google Cloud Platform", and "Professional Cloud Architect" are trademarks or registered trademarks of <strong>Google LLC</strong>.</p>
        <p>References to these trademarks and examination domains are made strictly under <em>nominative fair use</em> to identify the certification program and technical subject matter.</p>
        <h4>3. Official Registrations</h4>
        <p>Sitting for the official exam requires scheduling directly through Google Cloud authorized test delivery providers (Kryterion / Webassessor). This app does not sell official exam vouchers.</p>
      `,
      terms: `
        <h4>1. Acceptance of Terms</h4>
        <p>By using this study simulator, you acknowledge and agree to these Terms of Service.</p>
        <h4>2. Educational Purpose</h4>
        <p>All materials are provided solely for educational and self-assessment purposes. <strong>We provide no guarantee of passing the official examination</strong>, as performance depends on individual study and real-world architecture experience.</p>
        <h4>3. Intellectual Property</h4>
        <p>Application source code, user interface, explanations, and custom content are protected by copyright laws. Scraping, unauthorized redistribution, or reselling is prohibited.</p>
      `,
      privacy: `
        <h4>1. Data Protection & Google API Policies</h4>
        <p>We take privacy seriously and operate in full compliance with data privacy regulations (GDPR/LGPD) and Google API Services User Data Policies.</p>
        <h4>2. Data Collected via Google Identity</h4>
        <p>When signing in with your Google Account, we only access minimal profile attributes required to provide the service:</p>
        <ul>
          <li><strong>Name and Email:</strong> For account identity and communications.</li>
          <li><strong>Profile Picture:</strong> Displayed on the user badge.</li>
          <li><strong>Unique Google ID (sub):</strong> To isolate your quiz progress securely in Firestore.</li>
        </ul>
        <h4>3. No Data Selling</h4>
        <p>We <strong>do not sell, rent, or share</strong> your personal data with third-party advertising networks.</p>
      `
    }
  };

  let activeLegalTab = 'disclaimer';

  function openLegalModal(tab = 'disclaimer') {
    activeLegalTab = tab;
    const modal = document.getElementById('modal-legal');
    if (!modal) return;

    document.querySelectorAll('.legal-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-legal-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderLegalModalBody();
    modal.classList.add('open');
  }

  function closeLegalModal() {
    const modal = document.getElementById('modal-legal');
    if (modal) modal.classList.remove('open');
  }

  function renderLegalModalBody() {
    const body = document.getElementById('modal-legal-body');
    const lang = (uiLanguage === 'pt' || uiLanguage === 'en') ? uiLanguage : 'pt';
    const content = LEGAL_CONTENT[lang] || LEGAL_CONTENT.pt;
    if (body) {
      body.innerHTML = content[activeLegalTab] || content.disclaimer;
    }
  }

  function applyUILanguage() {
    const t = I18N[uiLanguage] || I18N.pt;
    document.documentElement.lang = uiLanguage === 'pt' ? 'pt-BR' : 'en';

    // Header Subtitle
    const headerSub = document.getElementById('app-header-subtitle');
    if (headerSub) {
      headerSub.textContent = t.appSubtitle;
    }

    // Login Screen Strings
    const loginSubtitle = document.getElementById('login-subtitle');
    if (loginSubtitle) {
      loginSubtitle.textContent = t.loginSubtitle;
    }
    const featCloudTitle = document.getElementById('feature-cloud-title');
    if (featCloudTitle) {
      featCloudTitle.textContent = uiLanguage === 'pt' ? 'Sincronização em Nuvem (Firestore)' : 'Cloud Synchronization (Firestore)';
    }
    const featCloudDesc = document.getElementById('feature-cloud-desc');
    if (featCloudDesc) {
      featCloudDesc.textContent = uiLanguage === 'pt'
        ? 'Seu progresso nos 7 simulados (420 questões) é salvo com isolamento total por conta Google.'
        : 'Your progress in the 7 practice exams (420 questions) is securely isolated per Google account.';
    }
    const featHistTitle = document.getElementById('feature-history-title');
    if (featHistTitle) {
      featHistTitle.textContent = uiLanguage === 'pt' ? 'Desempenho por Domínio do Exame' : 'Exam Domain Performance';
    }
    const featHistDesc = document.getElementById('feature-history-desc');
    if (featHistDesc) {
      featHistDesc.textContent = uiLanguage === 'pt'
        ? 'Histórico completo de notas e diagnóstico percentual nas 6 seções do Guia do Exame Google Cloud.'
        : 'Comprehensive score history and percentage diagnostics across the 6 exam guide domains.';
    }
    const featMultiTitle = document.getElementById('feature-multi-title');
    if (featMultiTitle) {
      featMultiTitle.textContent = uiLanguage === 'pt' ? 'Continuidade Multi-Dispositivo' : 'Multi-Device Continuity';
    }
    const featMultiDesc = document.getElementById('feature-multi-desc');
    if (featMultiDesc) {
      featMultiDesc.textContent = uiLanguage === 'pt'
        ? 'Comece a estudar no computador e retome no celular exatamente de onde parou.'
        : 'Start studying on desktop and pick up on mobile right where you left off.';
    }

    // Dashboard Static Strings
    const heroH2 = document.querySelector('.hero-banner h2');
    if (heroH2) heroH2.textContent = t.heroTitle;
    const heroP = document.querySelector('.hero-banner p');
    if (heroP) heroP.textContent = t.heroSubtitle;

    const badges = document.querySelectorAll('.hero-badge');
    if (badges.length >= 5) {
      badges[0].textContent = t.badge7Quizzes;
      badges[1].textContent = t.badge60Q;
      badges[2].textContent = t.badge420Q;
      badges[3].textContent = t.badgeSecDist;
      badges[4].textContent = t.badge120Min;
    }

    const secTitles = document.querySelectorAll('.section-title');
    if (secTitles.length >= 2) {
      secTitles[0].textContent = t.step1Title;
      secTitles[1].textContent = t.step2Title;
    }

    // Mode Cards
    const cardSimulado = document.querySelector('.mode-card[data-mode="simulado"]');
    if (cardSimulado) {
      cardSimulado.querySelector('.mode-badge').textContent = t.modeStudyBadge;
      cardSimulado.querySelector('h3').textContent = t.modeStudyTitle;
      cardSimulado.querySelector('p').textContent = t.modeStudyDesc;
      const list = cardSimulado.querySelectorAll('.mode-features li');
      if (list.length >= 4) {
        list[0].innerHTML = t.modeStudyF1;
        list[1].innerHTML = t.modeStudyF2;
        list[2].innerHTML = t.modeStudyF3;
        list[3].innerHTML = t.modeStudyF4;
      }
    }

    const cardExame = document.querySelector('.mode-card[data-mode="exame"]');
    if (cardExame) {
      cardExame.querySelector('.mode-badge').textContent = t.modeExamBadge;
      cardExame.querySelector('h3').textContent = t.modeExamTitle;
      cardExame.querySelector('p').textContent = t.modeExamDesc;
      const list = cardExame.querySelectorAll('.mode-features li');
      if (list.length >= 4) {
        list[0].innerHTML = t.modeExamF1;
        list[1].innerHTML = t.modeExamF2;
        list[2].innerHTML = t.modeExamF3;
        list[3].innerHTML = t.modeExamF4;
      }
    }

    // Active Quiz Strings
    btnPrev.textContent = t.btnPrev;
    btnNext.textContent = t.btnNext;
    btnFinish.innerHTML = t.btnFinish;
    hintToggleBtn.innerHTML = t.hintBtn;

    if (selectedMode === 'exame') {
      modeHeaderBadge.textContent = t.modeExameBadge;
      btnSaveExit.textContent = t.btnAbandonExam;
    } else {
      modeHeaderBadge.textContent = t.modeSimuladoBadge;
      btnSaveExit.textContent = t.btnSaveExit;
    }

    // Footer Strings
    const fBrand = document.querySelector('.footer-brand');
    if (fBrand) fBrand.innerHTML = t.footerBrand;
    const fDisc = document.getElementById('footer-disclaimer-text');
    if (fDisc) fDisc.innerHTML = t.footerDisclaimer;
    const fNoticeBtn = document.querySelector('[data-open-legal="disclaimer"]');
    if (fNoticeBtn) fNoticeBtn.textContent = t.footerLegalNotice;
    const fTermsBtn = document.querySelector('[data-open-legal="terms"]');
    if (fTermsBtn) fTermsBtn.textContent = t.footerTerms;
    const fPrivacyBtn = document.querySelector('[data-open-legal="privacy"]');
    if (fPrivacyBtn) fPrivacyBtn.textContent = t.footerPrivacy;
    const fGuideLink = document.querySelector('.footer-external-link');
    if (fGuideLink) fGuideLink.textContent = t.footerExamGuideLink;
    const fCopy = document.querySelector('.footer-copy');
    if (fCopy) fCopy.innerHTML = t.footerCopyright;

    // Legal Modal Title & Re-render if open
    const modalLegalTitle = document.getElementById('modal-legal-title');
    if (modalLegalTitle) modalLegalTitle.textContent = t.legalModalTitle;
    renderLegalModalBody();

    if (activeQuiz) {
      renderCurrentQuestion();
    } else {
      renderDashboard();
    }
  }

  // Event Listeners
  function setupEventListeners() {
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Mode Selector in Dashboard
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedMode = card.getAttribute('data-mode');
      });
    });

    // Logo Click
    document.getElementById('logo-group').addEventListener('click', () => {
      const t = I18N[uiLanguage];
      if (screenQuiz.classList.contains('active')) {
        showConfirmModal(
          uiLanguage === 'pt' ? 'Voltar ao Início' : 'Return to Dashboard',
          selectedMode === 'exame'
            ? (uiLanguage === 'pt' ? 'Atenção: No Modo Exame o progresso não é salvo. Deseja sair?' : 'Attention: In Exam Mode progress is not saved. Do you want to exit?')
            : (uiLanguage === 'pt' ? 'Seu progresso no Modo Simulado está salvo. Deseja sair?' : 'Your practice mode progress is saved. Do you want to exit?'),
          () => {
            stopTimer();
            switchScreen(screenDashboard);
            renderDashboard();
          }
        );
      } else if (screenResults.classList.contains('active')) {
        switchScreen(screenDashboard);
        renderDashboard();
      }
    });

    // Navigation
    btnPrev.addEventListener('click', () => {
      navigateQuestion(-1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btnNext.addEventListener('click', () => {
      navigateQuestion(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    flagBtn.addEventListener('click', toggleFlagQuestion);

    // Mobile Bottom Sheet Events
    if (btnOpenGridMobile) btnOpenGridMobile.addEventListener('click', openMobileSidebar);
    if (btnQuickGrid) btnQuickGrid.addEventListener('click', openMobileSidebar);
    if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    hintToggleBtn.addEventListener('click', () => {
      hintBox.classList.toggle('open');
    });

    revealAnswerBtn.addEventListener('click', () => {
      const q = activeQuiz.questions[currentQuestionIndex];
      revealedExplanations[q.id] = !revealedExplanations[q.id];
      renderCurrentQuestion();
    });

    btnFinish.addEventListener('click', () => {
      const answeredCount = Object.keys(userAnswers).length;
      const totalCount = activeQuiz.questions.length;
      const unanswered = totalCount - answeredCount;

      showConfirmModal(
        uiLanguage === 'pt' ? 'Finalizar Simulado / Exame' : 'Submit Exam',
        unanswered > 0
          ? (uiLanguage === 'pt'
              ? `Você respondeu ${answeredCount} de ${totalCount} questões (${unanswered} não respondidas). Deseja finalizar agora?`
              : `You answered ${answeredCount} of ${totalCount} questions (${unanswered} unanswered). Do you want to submit now?`)
          : (uiLanguage === 'pt'
              ? `Você respondeu todas as ${totalCount} questões! Deseja finalizar e ver o resultado?`
              : `You answered all ${totalCount} questions! Do you want to submit and view your results?`),
        () => finishQuiz()
      );
    });

    btnSaveExit.addEventListener('click', () => {
      if (selectedMode === 'exame') {
        showConfirmModal(
          uiLanguage === 'pt' ? 'Abandonar Exame' : 'Abandon Exam',
          uiLanguage === 'pt'
            ? 'No Modo Exame o progresso não é salvo. Deseja realmente abandonar?'
            : 'In Exam Mode progress is not saved. Do you really want to abandon?',
          () => {
            stopTimer();
            switchScreen(screenDashboard);
            renderDashboard();
          }
        );
      } else {
        saveProgressLocally();
        stopTimer();
        switchScreen(screenDashboard);
        renderDashboard();
        const isCloud = CloudStorage.isFirestoreActive();
        showToast({
          type: 'success',
          title: uiLanguage === 'pt' ? 'Progresso Salvo com Sucesso!' : 'Progress Saved Successfully!',
          message: uiLanguage === 'pt'
            ? (isCloud ? 'Suas respostas foram salvas no Firestore (Enterprise) e no cache local!' : 'Suas respostas e a questão atual foram salvas. Você pode retomar a qualquer momento!')
            : (isCloud ? 'Progress saved to Firestore and local cache!' : 'Your answers and current question have been saved. You can resume anytime!'),
          duration: 4000
        });
      }
    });

    // Modal Events
    modalBtnCancel.addEventListener('click', () => {
      modalConfirm.classList.remove('open');
      modalConfirmCallback = null;
    });

    modalBtnConfirm.addEventListener('click', () => {
      modalConfirm.classList.remove('open');
      if (modalConfirmCallback) modalConfirmCallback();
      modalConfirmCallback = null;
    });

    // Legal Modal Events
    document.querySelectorAll('[data-open-legal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-open-legal') || 'disclaimer';
        openLegalModal(tab);
      });
    });

    document.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-legal-tab') || 'disclaimer';
        openLegalModal(tab);
      });
    });

    const btnCloseLegal = document.getElementById('modal-legal-btn-close');
    if (btnCloseLegal) btnCloseLegal.addEventListener('click', closeLegalModal);

    const btnOkLegal = document.getElementById('modal-legal-btn-ok');
    if (btnOkLegal) btnOkLegal.addEventListener('click', closeLegalModal);

    const modalLegal = document.getElementById('modal-legal');
    if (modalLegal) {
      modalLegal.addEventListener('click', (e) => {
        if (e.target === modalLegal) closeLegalModal();
      });
    }

    // Keyboard ESC to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLegalModal();
        if (modalConfirm) modalConfirm.classList.remove('open');
      }
    });
  }

  // Dashboard Rendering
  function renderDashboard() {
    if (!quizDatabase) return;
    const t = I18N[uiLanguage];

    quizGridContainer.innerHTML = '';
    timerBadge.style.display = 'none';
    modeHeaderBadge.style.display = 'none';

    quizDatabase.quizzes.forEach(quiz => {
      const savedKey = `gcp_pca_saved_simulado_${quiz.id}`;
      const savedDataRaw = localStorage.getItem(savedKey);
      let savedData = null;
      if (savedDataRaw) {
        try { savedData = JSON.parse(savedDataRaw); } catch (e) {}
      }

      const card = document.createElement('div');
      card.className = 'quiz-card';

      // Section distribution pills
      let sectionPillsHtml = '';
      if (quiz.sectionDistribution) {
        for (const [secId, count] of Object.entries(quiz.sectionDistribution)) {
          const sec = quizDatabase.sections[secId];
          if (sec && count > 0) {
            const secName = uiLanguage === 'pt' && sec.shortName_pt ? sec.shortName_pt : sec.shortName;
            sectionPillsHtml += `
              <span class="section-pill" style="background-color: ${sec.color}" title="${sec.name}: ${count}">
                Sec ${secId}: ${count}
              </span>
            `;
          }
        }
      }

      // Saved banner
      let savedHtml = '';
      if (savedData && savedData.userAnswers) {
        const answeredCount = Object.keys(savedData.userAnswers).length;
        savedHtml = `
          <div class="saved-progress-banner">
            <span>${t.savedProgress} <strong>${answeredCount}/60</strong></span>
            <button class="btn btn-outline btn-discard-saved" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" data-quiz-id="${quiz.id}">${t.discardSaved}</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="quiz-card-header">
            <h3>${quiz.title}</h3>
            <span class="quiz-badge-count">60 ${uiLanguage === 'pt' ? 'Questões' : 'Questions'}</span>
          </div>
          <div class="quiz-card-body">
            <p>${quiz.description}</p>
            <div class="section-pill-list">
              ${sectionPillsHtml}
            </div>
            ${savedHtml}
          </div>
        </div>
        <div class="quiz-card-footer">
          ${savedData ? `
            <button class="btn btn-primary btn-quiz-continue" data-quiz-id="${quiz.id}">
              ${t.btnContinue}
            </button>
            <button class="btn btn-outline btn-quiz-restart" data-quiz-id="${quiz.id}">
              ${t.btnRestart}
            </button>
          ` : `
            <button class="btn btn-primary btn-quiz-start" data-quiz-id="${quiz.id}">
              ${t.btnStart}
            </button>
          `}
        </div>
      `;

      // Attach non-inline event listeners to comply strictly with CSP policies
      const discardBtn = card.querySelector('.btn-discard-saved');
      if (discardBtn) {
        discardBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.clearSavedProgress(quiz.id, e);
        });
      }

      const continueBtn = card.querySelector('.btn-quiz-continue');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => window.startQuiz(quiz.id, true));
      }

      const restartBtn = card.querySelector('.btn-quiz-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => window.startQuiz(quiz.id, false));
      }

      const startBtn = card.querySelector('.btn-quiz-start');
      if (startBtn) {
        startBtn.addEventListener('click', () => window.startQuiz(quiz.id, false));
      }

      quizGridContainer.appendChild(card);
    });
  }

  window.clearSavedProgress = function (quizId, e) {
    if (e) e.stopPropagation();
    const t = I18N[uiLanguage];
    showConfirmModal(
      uiLanguage === 'pt' ? 'Descartar Progresso' : 'Discard Progress',
      t.confirmDiscard,
      () => {
        localStorage.removeItem(`gcp_pca_saved_simulado_${quizId}`);
        CloudStorage.deleteProgress(quizId);
        renderDashboard();
        showToast({
          type: 'info',
          title: uiLanguage === 'pt' ? 'Progresso Descartado' : 'Progress Discarded',
          message: uiLanguage === 'pt' ? 'O progresso salvo deste simulado foi descartado.' : 'Saved progress for this exam has been discarded.',
          duration: 3000
        });
      }
    );
  };

  window.startQuiz = async function (quizId, resumeSaved) {
    const quiz = quizDatabase.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    const t = I18N[uiLanguage];

    // Se as questões ainda não estiverem na memória do cliente, busca do Firestore sob demanda
    if (!quiz.questions || quiz.questions.length === 0) {
      showToast({
        type: 'info',
        title: uiLanguage === 'pt' ? 'Carregando Simulado' : 'Loading Quiz',
        message: uiLanguage === 'pt' ? `Buscando 60 questões do Simulado ${quizId} no Firestore...` : `Fetching 60 questions for Quiz ${quizId} from Firestore...`,
        duration: 1800
      });

      try {
        const res = await authFetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.quiz && result.quiz.questions) {
            quiz.questions = result.quiz.questions;
            console.log(`[QuizApp] ${quiz.questions.length} questões carregadas para o Simulado ${quizId} (${result.source})`);
          }
        }
      } catch (err) {
        console.warn(`[QuizApp] Falha ao carregar questões do Simulado ${quizId} do Firestore:`, err.message);
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        showToast({
          type: 'error',
          title: uiLanguage === 'pt' ? 'Erro' : 'Error',
          message: uiLanguage === 'pt' ? 'Não foi possível carregar as questões deste simulado.' : 'Failed to load questions for this quiz.',
          duration: 4000
        });
        return;
      }
    }

    activeQuiz = quiz;
    currentQuestionIndex = 0;
    userAnswers = {};
    flaggedQuestions = {};
    revealedExplanations = {};
    timeElapsed = 0;

    // Check saved state for Simulado
    if (resumeSaved && selectedMode === 'simulado') {
      const savedKey = `gcp_pca_saved_simulado_${quizId}`;
      const savedDataRaw = localStorage.getItem(savedKey);
      if (savedDataRaw) {
        try {
          const parsed = JSON.parse(savedDataRaw);
          userAnswers = parsed.userAnswers || {};
          flaggedQuestions = parsed.flaggedQuestions || {};
          currentQuestionIndex = parsed.currentQuestionIndex || 0;
          timeElapsed = parsed.timeElapsed || 0;
        } catch (e) {}
      }
    }

    // Configure for Selected Mode
    if (selectedMode === 'exame') {
      timeRemaining = 120 * 60; // 120 minutes
      timerBadge.style.display = 'inline-flex';
      modeHeaderBadge.textContent = t.modeExameBadge;
      modeHeaderBadge.className = 'mode-badge exame';
      modeHeaderBadge.style.display = 'inline-block';
      revealAnswerBtn.style.display = 'none';
      hintToggleBtn.style.display = 'none';
      btnSaveExit.textContent = t.btnAbandonExam;
      startExamTimer();
    } else {
      timerBadge.style.display = 'inline-flex';
      modeHeaderBadge.textContent = t.modeSimuladoBadge;
      modeHeaderBadge.className = 'mode-badge simulado';
      modeHeaderBadge.style.display = 'inline-block';
      revealAnswerBtn.style.display = 'inline-flex';
      hintToggleBtn.style.display = 'inline-flex';
      btnSaveExit.textContent = t.btnSaveExit;
      startStudyTimer();
    }

    quizTitleEl.textContent = activeQuiz.title;
    switchScreen(screenQuiz);
    renderQuestionNavigator();
    renderCurrentQuestion();

    // Prefetch upcoming translations
    prefetchNextQuestions(currentQuestionIndex, 2);
  };

  // Timer logic
  function startExamTimer() {
    stopTimer();
    isTimerRunning = true;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeRemaining--;
      timeElapsed++;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        stopTimer();
        showToast({
          type: 'warning',
          title: uiLanguage === 'pt' ? 'Tempo Limite Esgotado (120 min)' : 'Time Limit Reached',
          message: uiLanguage === 'pt'
            ? 'O tempo de 120 minutos se esgotou! O exame será finalizado e corrigido automaticamente.'
            : 'The 120-minute limit expired! Submitting exam automatically.',
          duration: 5000
        });
        finishQuiz();
      }
    }, 1000);
  }

  function startStudyTimer() {
    stopTimer();
    isTimerRunning = true;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeElapsed++;
      updateTimerDisplay();
      if (timeElapsed % 30 === 0) {
        saveProgressLocally();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isTimerRunning = false;
  }

  function updateTimerDisplay() {
    if (selectedMode === 'exame') {
      const hrs = Math.floor(timeRemaining / 3600);
      const mins = Math.floor((timeRemaining % 3600) / 60);
      const secs = timeRemaining % 60;
      timerDisplay.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      timerBadge.classList.remove('urgent', 'warning');
      if (timeRemaining <= 600) {
        timerBadge.classList.add('urgent');
      } else if (timeRemaining <= 1800) {
        timerBadge.classList.add('warning');
      }
    } else {
      const hrs = Math.floor(timeElapsed / 3600);
      const mins = Math.floor((timeElapsed % 3600) / 60);
      const secs = timeElapsed % 60;
      timerDisplay.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      timerBadge.classList.remove('urgent', 'warning');
    }
  }

  // Navigation
  function navigateQuestion(offset) {
    const newIdx = currentQuestionIndex + offset;
    if (newIdx >= 0 && newIdx < activeQuiz.questions.length) {
      currentQuestionIndex = newIdx;
      renderCurrentQuestion();
      prefetchNextQuestions(currentQuestionIndex, 2);
      if (selectedMode === 'simulado') {
        saveProgressLocally();
      }
    }
  }

  window.goToQuestion = function (idx) {
    if (idx >= 0 && idx < activeQuiz.questions.length) {
      currentQuestionIndex = idx;
      renderCurrentQuestion();
      prefetchNextQuestions(currentQuestionIndex, 2);
      closeMobileSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function toggleFlagQuestion() {
    const q = activeQuiz.questions[currentQuestionIndex];
    if (flaggedQuestions[q.id]) {
      delete flaggedQuestions[q.id];
    } else {
      flaggedQuestions[q.id] = true;
    }
    renderCurrentQuestion();
    renderQuestionNavigator();
    if (selectedMode === 'simulado') {
      saveProgressLocally();
    }
  }

  // Render Current Question with Bilingual Support
  async function renderCurrentQuestion() {
    const q = activeQuiz.questions[currentQuestionIndex];
    const totalQuestions = activeQuiz.questions.length;
    const t = I18N[uiLanguage];

    // Header info
    questionIndexEl.textContent = `${uiLanguage === 'pt' ? 'Questão' : 'Question'} ${currentQuestionIndex + 1} / ${totalQuestions}`;
    quizProgressText.textContent = `${Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%`;
    quizProgressBarFill.style.width = `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;

    // Mobile quick grid button text
    if (quickGridText) {
      quickGridText.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
    }

    // Section Tag
    const secShort = uiLanguage === 'pt' && q.section.shortName_pt ? q.section.shortName_pt : q.section.shortName;
    questionSectionTag.textContent = `${secShort} (${q.section.weight})`;
    questionSectionTag.style.backgroundColor = q.section.color;
    questionSectionTag.style.color = '#fff';

    if (q.caseStudy) {
      questionCaseStudyTag.textContent = `Case Study: ${q.caseStudy}`;
      questionCaseStudyTag.style.display = 'inline-flex';
    } else {
      questionCaseStudyTag.style.display = 'none';
    }

    if (q.selectCount > 1) {
      questionSelectCountTag.textContent = t.selectN.replace('{n}', q.selectCount);
    } else {
      questionSelectCountTag.textContent = t.select1;
    }

    // Flag button
    if (flaggedQuestions[q.id]) {
      flagBtn.classList.add('flagged');
      flagBtn.innerHTML = t.flaggedReview;
    } else {
      flagBtn.classList.remove('flagged');
      flagBtn.innerHTML = t.flagReview;
    }

    // Render Question Text & Options depending on questionLanguage
    let questionHtml = '';
    let renderedOptions = {};
    let renderedExplanation = '';

    if (questionLanguage === 'en') {
      // 100% English Original
      questionHtml = formatMarkdown(q.question);
      renderedOptions = q.options;
      renderedExplanation = formatMarkdown(q.explanation);
    } else if (questionLanguage === 'pt') {
      // Portuguese (fetch if needed)
      if (q._translations && q._translations.pt) {
        questionHtml = formatMarkdown(q._translations.pt.question);
        renderedOptions = {};
        const sortedLetters = Object.keys(q._translations.pt.options).sort();
        for (const letter of sortedLetters) {
          renderedOptions[letter] = q._translations.pt.options[letter];
        }
        renderedExplanation = formatMarkdown(q._translations.pt.explanation);
      } else {
        // Show loading state while translating
        questionHtml = `<span class="trans-loading-badge">${t.translating}</span><br>` + formatMarkdown(q.question);
        renderedOptions = q.options;
        renderedExplanation = formatMarkdown(q.explanation);

        // Async resolve and re-render seamlessly
        getQuestionTranslations(q).then(() => {
          if (activeQuiz && activeQuiz.questions[currentQuestionIndex].id === q.id) {
            renderCurrentQuestion();
          }
        });
      }
    } else {
      // Bilingual (EN + PT)
      if (q._translations && q._translations.pt) {
        questionHtml = `
          <div>${formatMarkdown(q.question)}</div>
          <div class="bilingual-block">
            <span class="bilingual-label">${UI_ICONS.flagBR} Português</span>
            <div>${formatMarkdown(q._translations.pt.question)}</div>
          </div>
        `;
        renderedOptions = {};
        const sortedLetters = Object.keys(q.options).sort();
        for (const letter of sortedLetters) {
          const optText = q.options[letter];
          const transOpt = (q._translations.pt.options && q._translations.pt.options[letter]) || optText;
          renderedOptions[letter] = { en: optText, pt: transOpt };
        }
        renderedExplanation = `
          <div>${formatMarkdown(q.explanation)}</div>
          <div class="bilingual-block" style="margin-top: 0.75rem;">
            <span class="bilingual-label">${UI_ICONS.flagBR} Explicação em Português</span>
            <div>${formatMarkdown(q._translations.pt.explanation)}</div>
          </div>
        `;
      } else {
        questionHtml = `
          <div>${formatMarkdown(q.question)}</div>
          <div class="bilingual-block">
            <span class="trans-loading-badge">${t.translating}</span>
          </div>
        `;
        renderedOptions = q.options;
        renderedExplanation = formatMarkdown(q.explanation);

        getQuestionTranslations(q).then(() => {
          if (activeQuiz && activeQuiz.questions[currentQuestionIndex].id === q.id) {
            renderCurrentQuestion();
          }
        });
      }
    }

    questionTextEl.innerHTML = questionHtml;

    // Render Options (Enforce strict alphabetical order A, B, C, D, E, F)
    optionsListEl.innerHTML = '';
    const currentSelections = userAnswers[q.id] || [];
    const isRevealed = selectedMode === 'simulado' && revealedExplanations[q.id];

    const sortedOptionLetters = Object.keys(renderedOptions).sort();
    for (const letter of sortedOptionLetters) {
      const optValue = renderedOptions[letter];
      const isSelected = currentSelections.includes(letter);
      const isCorrect = q.answers.includes(letter);

      const optEl = document.createElement('div');
      optEl.className = `option-item ${isSelected ? 'selected' : ''}`;

      if (isRevealed) {
        if (isCorrect) optEl.classList.add('correct-reveal');
        else if (isSelected && !isCorrect) optEl.classList.add('wrong-reveal');
      }

      let labelHtml = '';
      if (typeof optValue === 'object' && optValue.en && optValue.pt) {
        labelHtml = `
          <div>${formatMarkdown(optValue.en)}</div>
          <span class="option-bilingual-trans">${UI_ICONS.flagBR} ${formatMarkdown(optValue.pt)}</span>
        `;
      } else {
        labelHtml = formatMarkdown(optValue);
      }

      optEl.innerHTML = `
        <div class="option-letter">${letter}</div>
        <div class="option-label">${labelHtml}</div>
      `;

      optEl.addEventListener('click', () => {
        handleOptionClick(q, letter);
      });

      optionsListEl.appendChild(optEl);
    }

    // Hint Content
    const hintText = (questionLanguage === 'en' || uiLanguage === 'en')
      ? (q.hint_en || q.hint)
      : (q.hint_pt || q.hint);
    hintContent.textContent = hintText || (uiLanguage === 'pt' ? 'Sem dica específica.' : 'No hint available.');
    hintBox.classList.remove('open');

    // Explanation Box (Study Mode)
    if (isRevealed) {
      explanationBox.style.display = 'block';
      explanationContent.innerHTML = `
        <p><strong>${t.officialAnswer}</strong> ${q.answers.join(', ')}</p>
        <div style="margin-top: 0.5rem;">${renderedExplanation}</div>
      `;
      revealAnswerBtn.textContent = t.btnHideReveal;
    } else {
      explanationBox.style.display = 'none';
      revealAnswerBtn.textContent = t.btnReveal;
    }

    btnPrev.disabled = currentQuestionIndex === 0;
    btnNext.disabled = currentQuestionIndex === totalQuestions - 1;

    renderQuestionNavigator();
  }

  // Handle Option Click
  function handleOptionClick(question, letter) {
    const qid = question.id;
    let current = userAnswers[qid] ? [...userAnswers[qid]] : [];

    if (question.selectCount === 1) {
      userAnswers[qid] = [letter];
    } else {
      if (current.includes(letter)) {
        current = current.filter(l => l !== letter);
      } else {
        if (current.length < question.selectCount) {
          current.push(letter);
        } else {
          current.shift();
          current.push(letter);
        }
      }
      userAnswers[qid] = current;
    }

    renderCurrentQuestion();
    renderQuestionNavigator();

    if (selectedMode === 'simulado') {
      saveProgressLocally();
    }
  }

  // Navigator Grid
  function renderQuestionNavigator() {
    questionsGridNav.innerHTML = '';
    activeQuiz.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'q-nav-btn';
      btn.textContent = idx + 1;

      if (idx === currentQuestionIndex) {
        btn.classList.add('current');
      }

      if (userAnswers[q.id] && userAnswers[q.id].length > 0) {
        btn.classList.add('answered');
      }

      if (flaggedQuestions[q.id]) {
        btn.classList.add('flagged');
      }

      btn.addEventListener('click', () => {
        goToQuestion(idx);
      });

      questionsGridNav.appendChild(btn);
    });
  }

  // Local Storage & Cloud Firestore Save
  function saveProgressLocally() {
    if (selectedMode !== 'simulado' || !activeQuiz) return;
    const saveState = {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      userAnswers: userAnswers,
      flaggedQuestions: flaggedQuestions,
      revealedExplanations: revealedExplanations,
      currentQuestionIndex: currentQuestionIndex,
      timeElapsed: timeElapsed,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`gcp_pca_saved_simulado_${activeQuiz.id}`, JSON.stringify(saveState));
    CloudStorage.saveProgress(activeQuiz.id, saveState);
  }

  // Finish Quiz & Results Calculation
  function finishQuiz() {
    stopTimer();
    closeMobileSidebar();

    if (selectedMode === 'simulado') {
      localStorage.removeItem(`gcp_pca_saved_simulado_${activeQuiz.id}`);
      CloudStorage.deleteProgress(activeQuiz.id);
    }

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const sectionStats = {};
    for (let s = 1; s <= 6; s++) {
      sectionStats[s] = { total: 0, correct: 0 };
    }

    const questionResults = activeQuiz.questions.map(q => {
      const userAns = userAnswers[q.id] || [];
      const isUnanswered = userAns.length === 0;

      const isCorrect = !isUnanswered &&
        userAns.length === q.answers.length &&
        userAns.slice().sort().every((val, index) => val === q.answers.slice().sort()[index]);

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      const sId = q.section.id;
      if (sectionStats[sId]) {
        sectionStats[sId].total++;
        if (isCorrect) sectionStats[sId].correct++;
      }

      return {
        question: q,
        userAnswers: userAns,
        isCorrect: isCorrect,
        isUnanswered: isUnanswered
      };
    });

    const totalQuestions = activeQuiz.questions.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = scorePct >= 70;

    renderResultsScreen({
      quizTitle: activeQuiz.title,
      mode: selectedMode,
      totalQuestions: totalQuestions,
      correctCount: correctCount,
      wrongCount: wrongCount,
      unansweredCount: unansweredCount,
      scorePct: scorePct,
      isPassed: isPassed,
      timeElapsed: timeElapsed,
      sectionStats: sectionStats,
      questionResults: questionResults
    });

    // Save final exam / simulado result in Cloud Firestore
    const hrs = Math.floor(timeElapsed / 3600);
    const mins = Math.floor((timeElapsed % 3600) / 60);
    const secs = timeElapsed % 60;
    const timeFormatted = `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`;

    CloudStorage.saveExamResult({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      mode: selectedMode,
      scorePercentage: scorePct,
      correctCount: correctCount,
      wrongCount: wrongCount,
      unansweredCount: unansweredCount,
      totalQuestions: totalQuestions,
      timeElapsed: timeElapsed,
      timeSpentFormatted: timeFormatted,
      breakdown: sectionStats
    });

    switchScreen(screenResults);
  }

  // Render Results Screen
  function renderResultsScreen(results) {
    const resultsContainer = document.getElementById('results-content');
    const t = I18N[uiLanguage];

    const hrs = Math.floor(results.timeElapsed / 3600);
    const mins = Math.floor((results.timeElapsed % 3600) / 60);
    const secs = results.timeElapsed % 60;
    const timeFormatted = `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs}s`;

    // Section Breakdown HTML
    let sectionBreakdownHtml = '';
    for (let sId = 1; sId <= 6; sId++) {
      const secInfo = quizDatabase.sections[sId];
      const stats = results.sectionStats[sId];
      const secPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      const secName = uiLanguage === 'pt' && secInfo.name_pt ? secInfo.name_pt : secInfo.name;

      sectionBreakdownHtml += `
        <div class="section-stat-row">
          <div class="section-stat-info">
            <span><strong>${secName}</strong> (${secInfo.weight})</span>
            <span><strong>${stats.correct}/${stats.total}</strong> (${secPct}%)</span>
          </div>
          <div class="section-stat-bar-bg">
            <div class="section-stat-bar-fill" style="width: ${secPct}%; background-color: ${secInfo.color}"></div>
          </div>
        </div>
      `;
    }

    // Review Cards
    const buildReviewCards = (filter) => {
      let filtered = results.questionResults;
      if (filter === 'wrong') filtered = results.questionResults.filter(r => !r.isCorrect && !r.isUnanswered);
      if (filter === 'correct') filtered = results.questionResults.filter(r => r.isCorrect);
      if (filter === 'unanswered') filtered = results.questionResults.filter(r => r.isUnanswered);

      if (filtered.length === 0) {
        return `<p style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">${uiLanguage === 'pt' ? 'Nenhuma questão encontrada para este filtro.' : 'No questions found for this filter.'}</p>`;
      }

      return filtered.map((item) => {
        const q = item.question;
        const userStr = item.userAnswers.length > 0 ? item.userAnswers.join(', ') : (uiLanguage === 'pt' ? 'Não respondida' : 'Unanswered');
        const correctStr = q.answers.join(', ');

        const qText = (questionLanguage === 'pt' && q._translations && q._translations.pt)
          ? q._translations.pt.question
          : q.question;

        const qExp = (questionLanguage === 'pt' && q._translations && q._translations.pt)
          ? q._translations.pt.explanation
          : q.explanation;

        const secShort = uiLanguage === 'pt' && q.section.shortName_pt ? q.section.shortName_pt : q.section.shortName;

        return `
          <div class="review-item-card ${item.isCorrect ? 'is-correct' : 'is-wrong'}">
            <div class="review-header">
              <span style="font-weight: 700; color: var(--primary);">${uiLanguage === 'pt' ? 'Questão' : 'Question'} ${q.quizQuestionIndex} (Q${q.originalNumber})</span>
              <span class="tag" style="background-color: ${q.section.color}; color: #fff;">${secShort}</span>
            </div>
            <div class="question-text" style="font-size: 0.95rem; margin-bottom: 0.75rem;">
              ${formatMarkdown(qText)}
            </div>
            <div class="review-ans-diff">
              <div class="review-ans-line ${item.isCorrect ? 'user-correct' : 'user-wrong'}">
                <strong>${t.yourAnswer}</strong> ${userStr} ${item.isCorrect ? t.statusCorrect : t.statusWrong}
              </div>
              ${!item.isCorrect ? `
                <div class="review-ans-line actual-correct">
                  <strong>${t.correctAnswer}</strong> ${correctStr}
                </div>
              ` : ''}
            </div>
            <div class="explanation-card" style="margin-top: 0.75rem;">
              <h4>${t.officialExplanation}</h4>
              <div>${formatMarkdown(qExp)}</div>
            </div>
          </div>
        `;
      }).join('');
    };

    resultsContainer.innerHTML = `
      <div class="results-card">
        <div class="results-header-banner">
          <div class="results-status-badge ${results.isPassed ? 'passed' : 'failed'}">
            ${results.isPassed ? t.passedBadge : t.failedBadge}
          </div>
          <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${results.quizTitle}</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            ${uiLanguage === 'pt' ? 'Modo:' : 'Mode:'} <strong>${results.mode === 'exame' ? t.modeExamTitle : t.modeStudyTitle}</strong> | ${uiLanguage === 'pt' ? 'Tempo total:' : 'Total time:'} <strong>${timeFormatted}</strong>
          </p>

          <div class="score-display-circle">
            <div class="percentage" style="color: ${results.isPassed ? 'var(--success)' : 'var(--error)'}">
              ${results.scorePct}%
            </div>
            <div class="target-label">${t.targetGoal}</div>
          </div>

          <div class="summary-stats-grid">
            <div class="stat-box">
              <div class="stat-value">${results.totalQuestions}</div>
              <div class="stat-label">${t.statTotal}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value correct">${results.correctCount}</div>
              <div class="stat-label">${t.statCorrect}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value wrong">${results.wrongCount}</div>
              <div class="stat-label">${t.statWrong}</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">${results.unansweredCount}</div>
              <div class="stat-label">${t.statUnanswered}</div>
            </div>
          </div>
        </div>

        <!-- Section Breakdown -->
        <div class="section-breakdown-card">
          <h3 style="margin-bottom: 1rem; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
            ${t.sectionBreakdownTitle}
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            ${t.sectionBreakdownDesc}
          </p>
          ${sectionBreakdownHtml}
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.75rem; justify-content: center;">
          <button class="btn btn-primary" id="btn-retake-quiz">
            ${t.btnRetake}
          </button>
          <button class="btn btn-outline" id="btn-back-dashboard">
            ${t.btnSelectOther}
          </button>
        </div>
      </div>

      <!-- Question Review -->
      <div style="margin-top: 2rem;">
        <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">${t.reviewTitle}</h3>
        
        <div class="review-filter-bar">
          <button class="filter-btn active" data-filter="all">${t.filterAll} (${results.totalQuestions})</button>
          <button class="filter-btn" data-filter="wrong">${t.filterWrong} (${results.wrongCount})</button>
          <button class="filter-btn" data-filter="correct">${t.filterCorrect} (${results.correctCount})</button>
          <button class="filter-btn" data-filter="unanswered">${t.filterUnanswered} (${results.unansweredCount})</button>
        </div>

        <div id="review-cards-list">
          ${buildReviewCards('all')}
        </div>
      </div>
    `;

    document.getElementById('btn-retake-quiz').addEventListener('click', () => {
      window.startQuiz(activeQuiz.id, false);
    });

    document.getElementById('btn-back-dashboard').addEventListener('click', () => {
      switchScreen(screenDashboard);
      renderDashboard();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.getElementById('review-cards-list').innerHTML = buildReviewCards(filter);
      });
    });
  }

  // Screen Switcher
  function switchScreen(targetScreen) {
    document.querySelectorAll('.view-screen').forEach(s => s.classList.remove('active'));
    targetScreen.classList.add('active');

    if (targetScreen === screenLogin) {
      if (modeHeaderBadge) modeHeaderBadge.style.display = 'none';
      if (timerBadge) timerBadge.style.display = 'none';
      if (userProfileBadge) userProfileBadge.style.display = 'none';
    } else if (currentUser) {
      if (userProfileBadge) userProfileBadge.style.display = 'inline-flex';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Modal helper
  function showConfirmModal(title, message, onConfirm) {
    modalTitle.textContent = title;
    modalBody.textContent = message;
    modalConfirmCallback = onConfirm;
    modalConfirm.classList.add('open');
  }

  // Markdown Formatter
  function formatMarkdown(text) {
    if (!text) return '';

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Extract code blocks into placeholders
    const codeBlocks = [];
    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
      return `___CODE_BLOCK_${idx}___`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Math clean up
    html = html.replace(/\$([0-9\/\+]+)\$/g, '$1');

    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');

    // Restore code blocks
    html = html.replace(/___CODE_BLOCK_(\d+)___/g, (match, idx) => {
      return codeBlocks[Number(idx)];
    });

    return html;
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
