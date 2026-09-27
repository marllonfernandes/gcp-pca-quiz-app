<template>
  <div class="quiz-view">
    <!-- Top Progress Bar (When answering questions) -->
    <div v-if="!isOverviewMode" class="quiz-top-progress">
      <div 
        class="progress-fill" 
        :style="{ width: `${store.progressPercentage}%` }"
      ></div>
    </div>

    <!-- ================================================================= -->
    <!-- VIEW A: STANDARD QUESTION RESOLUTION VIEW                         -->
    <!-- ================================================================= -->
    <div v-if="!isOverviewMode" class="quiz-content-container">
      <!-- Main Question Card -->
      <main class="question-main-card">
        <!-- Question Meta Header -->
        <div class="q-meta-header">
          <div class="q-meta-left">
            <span class="q-number-badge">
              {{ isPt ? 'Questão' : 'Question' }} {{ store.currentQuestionIndex + 1 }} / {{ store.totalQuestions }}
            </span>
            <span 
              class="q-tag domain-tag"
              :style="{ backgroundColor: currentQuestion?.section?.color || '#1a73e8' }"
            >
              {{ isPt && currentQuestion?.section?.shortName_pt ? currentQuestion.section.shortName_pt : currentQuestion?.section?.shortName }}
            </span>
            <span v-if="currentQuestion?.caseStudy" class="q-tag case-tag">
              Case: {{ currentQuestion.caseStudy }}
            </span>
            <span v-if="currentQuestion?.selectCount > 1" class="q-tag select-tag">
              {{ isPt ? `Selecione ${currentQuestion.selectCount} opções` : `Select ${currentQuestion.selectCount} options` }}
            </span>
          </div>

          <div class="q-meta-right">
            <!-- Question Language Toggle -->
            <div class="q-lang-toggle">
              <button 
                class="q-lang-btn" 
                :class="{ active: store.questionLanguage === 'pt' }"
                @click="store.setQuestionLanguage('pt')"
              >
                PT
              </button>
              <button 
                class="q-lang-btn" 
                :class="{ active: store.questionLanguage === 'en' }"
                @click="store.setQuestionLanguage('en')"
              >
                EN
              </button>
            </div>

            <!-- Flag Button -->
            <button 
              class="btn-flag" 
              :class="{ flagged: isFlagged }"
              @click="store.toggleFlag()"
              :title="isPt ? 'Marcar para revisão' : 'Flag for review'"
            >
              <i :class="isFlagged ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"></i>
              <span class="flag-text">{{ isPt ? 'Revisar' : 'Flag' }}</span>
            </button>
          </div>
        </div>

        <!-- Question Body -->
        <div class="q-body">
          <p class="q-text">{{ renderedQuestionText }}</p>

          <!-- Options List -->
          <div class="options-list">
            <div 
              v-for="letter in sortedOptionLetters" 
              :key="letter"
              class="option-row"
              :class="{
                selected: isOptionSelected(letter),
                'correct-reveal': isRevealed && isAnswerCorrect(letter),
                'wrong-reveal': isRevealed && isOptionSelected(letter) && !isAnswerCorrect(letter)
              }"
              @click="store.selectOption(letter)"
            >
              <div class="option-letter-badge">{{ letter }}</div>
              <div class="option-label-text">
                {{ getOptionText(letter) }}
              </div>
            </div>
          </div>

          <!-- Study Mode Actions & Hints -->
          <div v-if="store.selectedMode === 'simulado'" class="study-action-bar">
            <Button 
              v-if="currentQuestion?.hint"
              :label="isPt ? 'Dica Arquitetural' : 'Architectural Hint'" 
              icon="pi pi-lightbulb" 
              severity="secondary" 
              text 
              size="small"
              @click="isHintOpen = !isHintOpen"
            />

            <Button 
              :label="isRevealed ? (isPt ? 'Ocultar Justificativa' : 'Hide Answer') : (isPt ? 'Ver Gabarito & Justificativa' : 'Show Answer & Rationale')" 
              icon="pi pi-book" 
              severity="info" 
              text 
              size="small"
              @click="store.revealExplanation()"
            />
          </div>

          <!-- Hint Box -->
          <div v-if="isHintOpen && currentQuestion?.hint" class="hint-box">
            <strong>{{ isPt ? 'Dica Arquitetural:' : 'Architectural Hint:' }}</strong>
            <p>{{ isPt && currentQuestion.hint_pt ? currentQuestion.hint_pt : currentQuestion.hint }}</p>
          </div>

          <!-- Explanation Box -->
          <div v-if="isRevealed" class="explanation-box">
            <div class="explanation-header">
              <i class="pi pi-check-circle text-success"></i>
              <strong>{{ isPt ? 'Resposta Correta:' : 'Correct Answer:' }} {{ currentQuestion?.answers?.join(', ') }}</strong>
            </div>
            <div class="explanation-body">
              {{ renderedExplanationText }}
            </div>
          </div>
        </div>

        <!-- Desktop Action Footer -->
        <div class="desktop-quiz-footer">
          <Button 
            :label="isPt ? 'Anterior' : 'Previous'" 
            icon="pi pi-arrow-left" 
            severity="secondary" 
            outlined
            :disabled="store.currentQuestionIndex === 0"
            @click="store.prevQuestion()"
          />

          <Button 
            :label="isPt ? 'Mapa de Questões' : 'Questions Map'" 
            icon="pi pi-th-large" 
            severity="secondary" 
            text
            @click="isOverviewMode = true"
          />

          <Button 
            v-if="store.currentQuestionIndex < store.totalQuestions - 1"
            :label="isPt ? 'Próxima' : 'Next'" 
            icon="pi pi-arrow-right" 
            iconPos="right" 
            severity="primary" 
            @click="store.nextQuestion()"
          />

          <Button 
            v-else
            :label="isPt ? 'Finalizar Exame' : 'Submit Exam'" 
            icon="pi pi-check-circle" 
            severity="success" 
            @click="promptFinish"
          />
        </div>
      </main>

      <!-- Mobile Thumb Bar (Fixed Bottom) -->
      <div class="mobile-thumb-bar">
        <Button 
          icon="pi pi-arrow-left" 
          severity="secondary" 
          outlined
          :disabled="store.currentQuestionIndex === 0"
          @click="store.prevQuestion()"
        />

        <button 
          class="mobile-grid-trigger" 
          @click="isOverviewMode = true"
          title="Abrir mapa geral das 60 questões"
        >
          <i class="pi pi-th-large"></i>
          <span class="grid-counter">{{ store.currentQuestionIndex + 1 }} / {{ store.totalQuestions }}</span>
          <span class="grid-tag">{{ isPt ? 'Mapa' : 'Map' }}</span>
        </button>

        <Button 
          v-if="store.currentQuestionIndex < store.totalQuestions - 1"
          icon="pi pi-arrow-right" 
          severity="primary" 
          class="flex-1"
          @click="store.nextQuestion()"
        />

        <Button 
          v-else
          :label="isPt ? 'Finalizar' : 'Submit'" 
          icon="pi pi-check" 
          severity="success" 
          class="flex-1"
          @click="promptFinish"
        />
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- VIEW B: FULL-PAGE QUESTIONS OVERVIEW MAP (REPLACES POPUP MODAL)    -->
    <!-- ================================================================= -->
    <div v-else class="quiz-overview-page">
      <div class="overview-container">
        <!-- Top Navigation Header -->
        <div class="overview-header">
          <button class="btn-back-question" @click="isOverviewMode = false">
            <i class="pi pi-arrow-left"></i>
            <span>{{ isPt ? `Voltar para Questão ${store.currentQuestionIndex + 1}` : `Back to Question ${store.currentQuestionIndex + 1}` }}</span>
          </button>

          <div class="overview-header-titles">
            <h2>{{ isPt ? 'Mapa de Questões do Exame' : 'Exam Questions Map' }}</h2>
            <p>{{ isPt ? 'Navegue rapidamente entre as 60 questões ou revise as marcadas antes de finalizar.' : 'Review status of all 60 questions or jump to any item.' }}</p>
          </div>
        </div>

        <!-- Summary Metrics Card -->
        <div class="overview-metrics-card">
          <div class="metric-col">
            <span class="metric-num text-primary">{{ store.answeredCount }}</span>
            <span class="metric-label">{{ isPt ? 'Respondidas' : 'Answered' }}</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-col">
            <span class="metric-num text-secondary">{{ store.totalQuestions - store.answeredCount }}</span>
            <span class="metric-label">{{ isPt ? 'Em Branco' : 'Blank' }}</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-col">
            <span class="metric-num text-warning">{{ flaggedCount }}</span>
            <span class="metric-label">{{ isPt ? 'Para Revisar' : 'Flagged' }}</span>
          </div>
        </div>

        <!-- Quick Filter Pills -->
        <div class="overview-filter-bar">
          <button 
            class="filter-tab"
            :class="{ active: overviewFilter === 'all' }"
            @click="overviewFilter = 'all'"
          >
            {{ isPt ? 'Todas' : 'All' }} ({{ store.totalQuestions }})
          </button>
          <button 
            class="filter-tab tab-blank"
            :class="{ active: overviewFilter === 'blank' }"
            @click="overviewFilter = 'blank'"
          >
            {{ isPt ? 'Em Branco' : 'Blank' }} ({{ store.totalQuestions - store.answeredCount }})
          </button>
          <button 
            class="filter-tab tab-flagged"
            :class="{ active: overviewFilter === 'flagged' }"
            @click="overviewFilter = 'flagged'"
          >
            {{ isPt ? 'Marcadas' : 'Flagged' }} ({{ flaggedCount }})
          </button>
          <button 
            class="filter-tab tab-answered"
            :class="{ active: overviewFilter === 'answered' }"
            @click="overviewFilter = 'answered'"
          >
            {{ isPt ? 'Respondidas' : 'Answered' }} ({{ store.answeredCount }})
          </button>
        </div>

        <!-- Full Responsive 60-Question Grid -->
        <div class="overview-grid">
          <button 
            v-for="(q, idx) in filteredOverviewQuestions" 
            :key="q.id || idx"
            class="overview-q-button"
            :class="{
              current: q.originalIndex === store.currentQuestionIndex,
              answered: isQuestionAnswered(q.id),
              flagged: isQuestionFlagged(q.id)
            }"
            @click="jumpToQuestion(q.originalIndex)"
          >
            <span class="q-btn-number">{{ q.originalIndex + 1 }}</span>
            <i v-if="isQuestionFlagged(q.id)" class="pi pi-bookmark-fill q-flag-icon"></i>
            <span v-if="q.originalIndex === store.currentQuestionIndex" class="current-indicator"></span>
          </button>
        </div>

        <!-- Bottom Actions Bar -->
        <div class="overview-footer-bar">
          <Button 
            :label="isPt ? 'Continuar Simulado' : 'Resume Exam'" 
            icon="pi pi-arrow-left" 
            severity="secondary" 
            outlined
            class="footer-action-btn"
            @click="isOverviewMode = false"
          />

          <Button 
            :label="isPt ? 'Finalizar e Ver Resultados' : 'Submit and See Results'" 
            icon="pi pi-check-circle" 
            severity="success" 
            class="footer-action-btn flex-1"
            @click="promptFinish"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';

const store = useQuizStore();
const confirm = useConfirm();

const isOverviewMode = ref(false);
const overviewFilter = ref('all'); // 'all' | 'blank' | 'flagged' | 'answered'
const isHintOpen = ref(false);

const isPt = computed(() => store.uiLanguage === 'pt');
const currentQuestion = computed(() => store.currentQuestion);

const isFlagged = computed(() => {
  const qid = currentQuestion.value?.id;
  return Boolean(qid && store.flaggedQuestions[qid]);
});

const isRevealed = computed(() => {
  const qid = currentQuestion.value?.id;
  return Boolean(qid && store.revealedExplanations[qid]);
});

const sortedOptionLetters = computed(() => {
  if (!currentQuestion.value?.options) return [];
  return Object.keys(currentQuestion.value.options).sort();
});

const renderedQuestionText = computed(() => {
  const q = currentQuestion.value;
  if (!q) return '';
  if (store.questionLanguage === 'pt' && q.question_pt) return q.question_pt;
  return q.question || '';
});

const renderedExplanationText = computed(() => {
  const q = currentQuestion.value;
  if (!q) return '';
  if (store.questionLanguage === 'pt' && q.explanation_pt) return q.explanation_pt;
  return q.explanation || '';
});

const flaggedCount = computed(() => {
  return Object.keys(store.flaggedQuestions).filter(k => store.flaggedQuestions[k]).length;
});

function isQuestionAnswered(qid) {
  return Boolean(store.userAnswers[qid] && store.userAnswers[qid].length > 0);
}

function isQuestionFlagged(qid) {
  return Boolean(store.flaggedQuestions[qid]);
}

const allQuestionsWithIndex = computed(() => {
  return (store.activeQuiz?.questions || []).map((q, idx) => ({
    ...q,
    originalIndex: idx
  }));
});

const filteredOverviewQuestions = computed(() => {
  const questions = allQuestionsWithIndex.value;
  if (overviewFilter.value === 'blank') {
    return questions.filter(q => !isQuestionAnswered(q.id));
  }
  if (overviewFilter.value === 'flagged') {
    return questions.filter(q => isQuestionFlagged(q.id));
  }
  if (overviewFilter.value === 'answered') {
    return questions.filter(q => isQuestionAnswered(q.id));
  }
  return questions;
});

function jumpToQuestion(idx) {
  store.goToQuestion(idx);
  isOverviewMode.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getOptionText(letter) {
  const q = currentQuestion.value;
  if (!q || !q.options) return '';
  if (store.questionLanguage === 'pt' && q.options_pt?.[letter]) {
    return q.options_pt[letter];
  }
  return q.options[letter] || '';
}

function isOptionSelected(letter) {
  const qid = currentQuestion.value?.id;
  return Boolean(qid && store.userAnswers[qid]?.includes(letter));
}

function isAnswerCorrect(letter) {
  return Boolean(currentQuestion.value?.answers?.includes(letter));
}

function promptFinish() {
  const answered = store.answeredCount;
  const total = store.totalQuestions;
  const unanswered = total - answered;

  confirm.require({
    message: unanswered > 0
      ? (isPt.value ? `Você respondeu ${answered} de ${total} questões (${unanswered} em branco). Deseja finalizar agora?` : `You answered ${answered} of ${total} questions (${unanswered} blank). Submit now?`)
      : (isPt.value ? `Você respondeu todas as ${total} questões! Deseja finalizar e ver a pontuação?` : `You answered all ${total} questions! Ready to see results?`),
    header: isPt.value ? 'Finalizar Exame' : 'Submit Exam',
    icon: 'pi pi-check-circle',
    accept: () => {
      store.finishQuiz();
    }
  });
}
</script>

<style scoped>
.quiz-view {
  min-height: calc(100vh - 60px);
  background-color: var(--bg-page);
}

.quiz-top-progress {
  height: 4px;
  background: var(--border-color);
  width: 100%;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.25s ease;
}

.quiz-content-container {
  max-width: 900px;
  margin: 1.5rem auto 5rem auto;
  padding: 0 1rem;
}

.question-main-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
}

/* Header */
.q-meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.35rem;
}

.q-meta-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.q-number-badge {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.q-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  color: #fff;
}

.case-tag {
  background: #f29900;
}

.select-tag {
  background: #9334e8;
}

.q-meta-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.q-lang-toggle {
  display: flex;
  background: var(--bg-subtle);
  border-radius: 12px;
  padding: 2px;
  border: 1px solid var(--border-color);
}

.q-lang-btn {
  border: none;
  background: transparent;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9px;
  cursor: pointer;
  color: var(--text-secondary);
}

.q-lang-btn.active {
  background: var(--bg-surface);
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-flag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-flag.flagged {
  border-color: var(--warning);
  background: var(--warning-light);
  color: #b06000;
}

/* Question Text */
.q-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

/* Options */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.option-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1rem 1.15rem;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.option-row:hover {
  border-color: var(--primary);
  background: var(--bg-subtle);
}

.option-row.selected {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 1.5px var(--primary);
}

.option-row.correct-reveal {
  border-color: var(--success);
  background: var(--success-light);
}

.option-row.wrong-reveal {
  border-color: var(--error);
  background: var(--error-light);
}

.option-letter-badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.option-row.selected .option-letter-badge {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.option-label-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Study Actions & Hint Box */
.study-action-bar {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
  margin-bottom: 1rem;
}

.hint-box {
  background: var(--warning-light);
  border: 1px solid var(--warning);
  border-radius: var(--radius-md);
  padding: 1rem;
  font-size: 0.88rem;
  color: #7d4400;
  margin-bottom: 1rem;
}

.explanation-box {
  background: var(--bg-subtle);
  border-left: 4px solid var(--success);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  padding: 1.15rem;
  margin-top: 1rem;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.explanation-body {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

/* Desktop Footer */
.desktop-quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1.5rem;
}

/* Mobile Thumb Bar */
.mobile-thumb-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 0.65rem 1rem max(0.65rem, env(safe-area-inset-bottom, 12px)) 1rem;
  z-index: 90;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  gap: 0.5rem;
  align-items: center;
}

.mobile-grid-trigger {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.85rem;
  background: var(--bg-subtle);
  border: 1.5px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  min-width: 85px;
}

.grid-counter {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.grid-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
}

/* ================================================================= */
/* FULL-PAGE OVERVIEW MAP STYLING                                    */
/* ================================================================= */
.quiz-overview-page {
  min-height: calc(100vh - 60px);
  background: var(--bg-page);
  padding: 1.25rem 1rem 5rem 1rem;
}

.overview-container {
  max-width: 900px;
  margin: 0 auto;
}

.overview-header {
  margin-bottom: 1.25rem;
}

.btn-back-question {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
  margin-bottom: 0.85rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.btn-back-question:hover {
  background: var(--bg-subtle);
}

.overview-header-titles h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.overview-header-titles p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Metrics Card */
.overview-metrics-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.metric-col {
  text-align: center;
}

.metric-num {
  display: block;
  font-size: 1.6rem;
  font-weight: 900;
  line-height: 1.1;
  font-family: var(--font-mono);
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-divider {
  width: 1px;
  height: 32px;
  background: var(--border-color);
}

/* Filter Bar */
.overview-filter-bar {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
  -webkit-overflow-scrolling: touch;
}

.filter-tab {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-tab.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

/* 60-Question Grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .overview-grid {
    grid-template-columns: repeat(10, 1fr);
    gap: 0.85rem;
  }
}

.overview-q-button {
  height: 52px;
  border-radius: 12px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.overview-q-button:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.q-btn-number {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

/* Answered Status */
.overview-q-button.answered {
  background: rgba(26, 115, 232, 0.12);
  border-color: var(--primary);
}

.overview-q-button.answered .q-btn-number {
  color: var(--primary);
}

/* Flagged Status */
.overview-q-button.flagged {
  border-color: var(--warning);
  background: rgba(249, 171, 0, 0.12);
}

.q-flag-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.65rem;
  color: #b06000;
}

/* Current Question Indicator */
.overview-q-button.current {
  box-shadow: 0 0 0 2.5px var(--primary);
}

.current-indicator {
  position: absolute;
  bottom: 4px;
  width: 12px;
  height: 3px;
  border-radius: 2px;
  background: var(--primary);
}

/* Bottom Action Bar */
.overview-footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom, 16px)) 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  z-index: 90;
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .quiz-content-container {
    padding: 0 0.5rem;
    margin-top: 0.75rem;
    margin-bottom: 5rem;
  }
  .question-main-card {
    padding: 1.15rem;
    border-radius: var(--radius-md);
  }
  .desktop-quiz-footer {
    display: none;
  }
  .mobile-thumb-bar {
    display: flex;
  }
  .overview-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
  }
  .overview-q-button {
    height: 48px;
  }
}
</style>
