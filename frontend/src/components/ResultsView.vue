<template>
  <div class="results-container">
    <!-- Top Result Banner Card -->
    <div class="result-hero-card" :class="isPassed ? 'passed' : 'failed'">
      <div class="result-badge">
        <i :class="isPassed ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
        <span>{{ isPassed ? (quizStore.lang === 'pt' ? 'APROVADO NA SIMULAÇÃO' : 'EXAM PASSED') : (quizStore.lang === 'pt' ? 'NECESSITA REVISÃO' : 'REVISION NEEDED') }}</span>
      </div>

      <div class="result-score-circle">
        <span class="score-percent">{{ percentage }}%</span>
        <span class="score-ratio">{{ correctCount }} / {{ totalQuestions }}</span>
      </div>

      <div class="result-feedback">
        <h2>{{ isPassed ? (quizStore.lang === 'pt' ? 'Parabéns, Arquiteto(a)!' : 'Great job, Architect!') : (quizStore.lang === 'pt' ? 'Continue praticando!' : 'Keep practicing!') }}</h2>
        <p>
          {{ isPassed 
            ? (quizStore.lang === 'pt' ? 'Sua pontuação atingiu o índice mínimo recomendado de 70% para o exame oficial.' : 'You achieved the 70% passing threshold recommended for the certification exam.') 
            : (quizStore.lang === 'pt' ? 'Você precisa de 70% ou mais para aprovação no padrão do Google Cloud. Analise os domínios abaixo.' : 'A minimum score of 70% is recommended. Review the blueprint domains below.') }}
        </p>
      </div>

      <!-- Quick Metrics -->
      <div class="result-stats-row">
        <div class="stat-box">
          <i class="pi pi-check text-green"></i>
          <div>
            <strong>{{ correctCount }}</strong>
            <small>{{ quizStore.lang === 'pt' ? 'Corretas' : 'Correct' }}</small>
          </div>
        </div>
        <div class="stat-box">
          <i class="pi pi-times text-red"></i>
          <div>
            <strong>{{ totalQuestions - correctCount }}</strong>
            <small>{{ quizStore.lang === 'pt' ? 'Incorretas' : 'Incorrect' }}</small>
          </div>
        </div>
        <div class="stat-box">
          <i class="pi pi-clock text-blue"></i>
          <div>
            <strong>{{ formattedTime }}</strong>
            <small>{{ quizStore.lang === 'pt' ? 'Tempo' : 'Time spent' }}</small>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="result-actions">
        <button class="btn btn-primary" @click="retakeQuiz">
          <i class="pi pi-refresh"></i>
          <span>{{ quizStore.lang === 'pt' ? 'Refazer Simulado' : 'Retake Exam' }}</span>
        </button>
        <button class="btn btn-secondary" @click="backToDashboard">
          <i class="pi pi-arrow-left"></i>
          <span>{{ quizStore.lang === 'pt' ? 'Painel de Simulados' : 'Back to Dashboard' }}</span>
        </button>
      </div>
    </div>

    <!-- Domain Breakdown Card -->
    <div class="card domain-breakdown-card">
      <div class="card-header">
        <div class="card-title">
          <i class="pi pi-chart-pie"></i>
          <span>{{ quizStore.lang === 'pt' ? 'Desempenho por Seção do Blueprint' : 'Blueprint Domain Breakdown' }}</span>
        </div>
      </div>

      <div class="domain-bars">
        <div 
          v-for="domain in domainStats" 
          :key="domain.name" 
          class="domain-bar-item"
        >
          <div class="domain-bar-header">
            <span class="domain-title">{{ domain.name }}</span>
            <span class="domain-score" :class="domain.pct >= 70 ? 'text-green' : 'text-red'">
              {{ domain.correct }}/{{ domain.total }} ({{ domain.pct }}%)
            </span>
          </div>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: domain.pct + '%', backgroundColor: domain.pct >= 70 ? '#34a853' : '#ea4335' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question-by-Question Review Section -->
    <div class="card review-card">
      <div class="review-header">
        <div>
          <h3>{{ quizStore.lang === 'pt' ? 'Revisão Detalhada das Questões' : 'Detailed Question Review' }}</h3>
          <p class="subtitle">{{ quizStore.lang === 'pt' ? 'Examine suas respostas com as justificativas arquiteturais do Google Cloud.' : 'Inspect your choices against Google Cloud architectural rationales.' }}</p>
        </div>

        <!-- Filter tabs -->
        <div class="filter-pills">
          <button 
            :class="['filter-pill', { active: filter === 'all' }]"
            @click="filter = 'all'"
          >
            {{ quizStore.lang === 'pt' ? 'Todas' : 'All' }} ({{ totalQuestions }})
          </button>
          <button 
            :class="['filter-pill pill-wrong', { active: filter === 'wrong' }]"
            @click="filter = 'wrong'"
          >
            {{ quizStore.lang === 'pt' ? 'Incorretas' : 'Incorrect' }} ({{ totalQuestions - correctCount }})
          </button>
          <button 
            :class="['filter-pill pill-correct', { active: filter === 'correct' }]"
            @click="filter = 'correct'"
          >
            {{ quizStore.lang === 'pt' ? 'Corretas' : 'Correct' }} ({{ correctCount }})
          </button>
        </div>
      </div>

      <!-- Question List -->
      <div class="review-list">
        <div 
          v-for="(item, idx) in filteredQuestions" 
          :key="item.q.id || idx"
          class="review-item"
          :class="item.isCorrect ? 'item-correct' : 'item-wrong'"
        >
          <div class="review-item-header" @click="toggleExpand(item.q.id)">
            <div class="review-item-meta">
              <span class="q-badge" :class="item.isCorrect ? 'badge-correct' : 'badge-wrong'">
                <i :class="item.isCorrect ? 'pi pi-check' : 'pi pi-times'"></i>
                <span>Q{{ item.originalIndex + 1 }}</span>
              </span>
              <span class="q-domain-tag">{{ item.q.domain || 'Google Cloud' }}</span>
            </div>

            <div class="review-expand-btn">
              <i :class="expandedItems[item.q.id] ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
            </div>
          </div>

          <div class="review-item-body">
            <p class="review-question-text">{{ getQuestionText(item.q) }}</p>

            <!-- Collapsible details (always shown or toggled) -->
            <div v-show="expandedItems[item.q.id] ?? true" class="review-details">
              <!-- Choices list -->
              <div class="review-choices">
                <div 
                  v-for="(choice, cIdx) in item.q.options" 
                  :key="cIdx"
                  class="review-choice"
                  :class="getChoiceClass(item, cIdx)"
                >
                  <span class="choice-letter">{{ getLetter(cIdx) }}</span>
                  <span class="choice-text">{{ getOptionText(choice) }}</span>
                  <span v-if="isAnswerChosen(item, cIdx)" class="choice-tag user-tag">
                    {{ quizStore.lang === 'pt' ? 'Sua escolha' : 'Your answer' }}
                  </span>
                  <span v-if="isAnswerCorrect(item, cIdx)" class="choice-tag correct-tag">
                    {{ quizStore.lang === 'pt' ? 'Correta' : 'Correct answer' }}
                  </span>
                </div>
              </div>

              <!-- Rationale -->
              <div v-if="item.q.rationale || item.q.explanation" class="review-rationale">
                <div class="rationale-header">
                  <i class="pi pi-info-circle"></i>
                  <span>{{ quizStore.lang === 'pt' ? 'Justificativa Arquitetural' : 'Architectural Rationale' }}</span>
                </div>
                <p>{{ getRationaleText(item.q) }}</p>

                <div v-if="item.q.docUrl" class="review-doc-link">
                  <a :href="item.q.docUrl" target="_blank" rel="noopener noreferrer">
                    <i class="pi pi-external-link"></i>
                    <span>{{ quizStore.lang === 'pt' ? 'Documentação Oficial Google Cloud' : 'Google Cloud Official Docs' }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredQuestions.length === 0" class="empty-filter">
          <i class="pi pi-check-circle empty-icon"></i>
          <p>{{ quizStore.lang === 'pt' ? 'Nenhuma questão neste filtro.' : 'No questions matching this filter.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuizStore } from '../stores/quizStore.js';

const quizStore = useQuizStore();

const filter = ref('all'); // 'all', 'wrong', 'correct'
const expandedItems = ref({});

function toggleExpand(id) {
  expandedItems.value[id] = !expandedItems.value[id];
}

const totalQuestions = computed(() => quizStore.activeQuestions.length || 0);

const resultsData = computed(() => {
  return quizStore.activeQuestions.map((q, idx) => {
    const userAns = quizStore.userAnswers[idx] || [];
    const correctAns = Array.isArray(q.answer) ? q.answer : [q.answer];

    // Check if user answer matches correct answers
    const isCorrect = userAns.length === correctAns.length &&
      userAns.slice().sort().every((val, i) => val === correctAns.slice().sort()[i]);

    return {
      q,
      originalIndex: idx,
      userAns,
      correctAns,
      isCorrect
    };
  });
});

const correctCount = computed(() => {
  return resultsData.value.filter(r => r.isCorrect).length;
});

const percentage = computed(() => {
  if (!totalQuestions.value) return 0;
  return Math.round((correctCount.value / totalQuestions.value) * 100);
});

const isPassed = computed(() => percentage.value >= 70);

const formattedTime = computed(() => {
  const elapsed = quizStore.elapsedTimeSeconds || 0;
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
});

// Domain Breakdown
const domainStats = computed(() => {
  const map = {};
  resultsData.value.forEach(item => {
    const dom = item.q.domain || (quizStore.lang === 'pt' ? 'Conhecimentos Gerais' : 'General Knowledge');
    if (!map[dom]) {
      map[dom] = { name: dom, total: 0, correct: 0 };
    }
    map[dom].total++;
    if (item.isCorrect) map[dom].correct++;
  });

  return Object.values(map).map(d => ({
    ...d,
    pct: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
  })).sort((a, b) => b.total - a.total);
});

// Filtered Questions
const filteredQuestions = computed(() => {
  if (filter.value === 'wrong') {
    return resultsData.value.filter(r => !r.isCorrect);
  }
  if (filter.value === 'correct') {
    return resultsData.value.filter(r => r.isCorrect);
  }
  return resultsData.value;
});

function getLetter(idx) {
  return String.fromCharCode(65 + idx);
}

function getQuestionText(q) {
  if (quizStore.lang === 'pt' && q.questionPt) return q.questionPt;
  return q.question || q.questionEn || '';
}

function getOptionText(opt) {
  if (typeof opt === 'string') return opt;
  if (quizStore.lang === 'pt' && opt.textPt) return opt.textPt;
  return opt.text || opt.textEn || '';
}

function getRationaleText(q) {
  if (quizStore.lang === 'pt' && q.rationalePt) return q.rationalePt;
  return q.rationale || q.explanation || (quizStore.lang === 'pt' ? 'Justificativa oficial baseada nos princípios de arquitetura do Google Cloud.' : 'Google Cloud architectural best practices.');
}

function isAnswerChosen(item, cIdx) {
  return item.userAns.includes(cIdx);
}

function isAnswerCorrect(item, cIdx) {
  return item.correctAns.includes(cIdx);
}

function getChoiceClass(item, cIdx) {
  const chosen = isAnswerChosen(item, cIdx);
  const correct = isAnswerCorrect(item, cIdx);

  if (chosen && correct) return 'choice-both-correct';
  if (chosen && !correct) return 'choice-user-wrong';
  if (!chosen && correct) return 'choice-should-be';
  return '';
}

function retakeQuiz() {
  quizStore.startQuiz(quizStore.activeQuizId, quizStore.quizMode);
}

function backToDashboard() {
  quizStore.currentScreen = 'dashboard';
}
</script>

<style scoped>
.results-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Result Hero Banner */
.result-hero-card {
  background: var(--surface-card);
  border-radius: 20px;
  padding: 2.2rem 1.5rem;
  text-align: center;
  border: 2px solid var(--surface-border);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-hero-card.passed {
  border-color: #34a853;
  background: linear-gradient(180deg, rgba(52, 168, 83, 0.08) 0%, var(--surface-card) 60%);
}

.result-hero-card.failed {
  border-color: #ea4335;
  background: linear-gradient(180deg, rgba(234, 67, 53, 0.08) 0%, var(--surface-card) 60%);
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.2rem;
}

.passed .result-badge {
  background: rgba(52, 168, 83, 0.15);
  color: #1e7e34;
}

.failed .result-badge {
  background: rgba(234, 67, 53, 0.15);
  color: #c5221f;
}

.result-score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
}

.passed .result-score-circle {
  border-color: #34a853;
  color: #1e7e34;
}

.failed .result-score-circle {
  border-color: #ea4335;
  color: #c5221f;
}

.score-percent {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
}

.score-ratio {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.8;
  margin-top: 0.2rem;
}

.result-feedback h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.result-feedback p {
  font-size: 0.95rem;
  color: var(--text-color-secondary);
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
}

.result-stats-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
  width: 100%;
  max-width: 500px;
  justify-content: center;
}

.stat-box {
  flex: 1;
  background: var(--surface-section);
  border: 1px solid var(--surface-border);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.stat-box i {
  font-size: 1.4rem;
}

.stat-box strong {
  display: block;
  font-size: 1.2rem;
  color: var(--text-color);
}

.stat-box small {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.text-green { color: #34a853 !important; }
.text-red { color: #ea4335 !important; }
.text-blue { color: #1a73e8 !important; }

.result-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Card General */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 16px;
  padding: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-color);
}

/* Domain Bars */
.domain-bars {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.domain-bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.domain-title {
  color: var(--text-color);
}

.progress-bar-bg {
  height: 10px;
  background: var(--surface-section);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease-out;
}

/* Review Section */
.review-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .review-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.review-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 0.2rem;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-pill {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--surface-border);
  background: var(--surface-section);
  color: var(--text-color-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill.active {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}

.filter-pill.pill-wrong.active {
  background: #ea4335;
  border-color: #ea4335;
}

.filter-pill.pill-correct.active {
  background: #34a853;
  border-color: #34a853;
}

/* Review Item */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  background: var(--surface-ground);
  overflow: hidden;
  transition: border-color 0.2s;
}

.review-item.item-correct {
  border-left: 5px solid #34a853;
}

.review-item.item-wrong {
  border-left: 5px solid #ea4335;
}

.review-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
  background: var(--surface-card);
  cursor: pointer;
  user-select: none;
}

.review-item-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.q-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-correct {
  background: rgba(52, 168, 83, 0.15);
  color: #1e7e34;
}

.badge-wrong {
  background: rgba(234, 67, 53, 0.15);
  color: #c5221f;
}

.q-domain-tag {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  font-weight: 500;
}

.review-item-body {
  padding: 1.1rem;
}

.review-question-text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.review-choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.review-choice {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  font-size: 0.88rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
}

.choice-letter {
  font-weight: 700;
  color: var(--text-color-secondary);
}

.choice-text {
  flex: 1;
  color: var(--text-color);
}

.choice-tag {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.user-tag {
  background: rgba(26, 115, 232, 0.1);
  color: #1a73e8;
}

.correct-tag {
  background: rgba(52, 168, 83, 0.15);
  color: #1e7e34;
}

.choice-both-correct {
  background: rgba(52, 168, 83, 0.08);
  border-color: #34a853;
}

.choice-user-wrong {
  background: rgba(234, 67, 53, 0.08);
  border-color: #ea4335;
}

.choice-should-be {
  background: rgba(52, 168, 83, 0.05);
  border-color: #34a853;
  border-style: dashed;
}

.review-rationale {
  background: rgba(26, 115, 232, 0.05);
  border: 1px solid rgba(26, 115, 232, 0.2);
  border-radius: 8px;
  padding: 0.9rem 1rem;
  font-size: 0.88rem;
}

.rationale-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 0.4rem;
}

.review-rationale p {
  color: var(--text-color);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.review-doc-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a73e8;
  text-decoration: underline;
}

.empty-filter {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-color-secondary);
}

.empty-icon {
  font-size: 2.5rem;
  color: #34a853;
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .result-stats-row {
    flex-direction: column;
    gap: 0.6rem;
  }
  .stat-box {
    width: 100%;
  }
  .result-actions {
    flex-direction: column;
    width: 100%;
  }
  .result-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>
