<template>
  <div class="dashboard-view">
    <!-- Hero Banner -->
    <div class="hero-banner">
      <h2>
        {{ isPt 
          ? `Simulados Preparatórios para ${activeExam?.name_pt || activeExam?.name || 'GCP'}` 
          : `Preparation Practice Exams for ${activeExam?.name || 'Google Cloud'}` 
        }}
      </h2>
      <p>
        {{ isPt ? activeExam?.description : (activeExam?.description_en || activeExam?.description) }}
      </p>

      <div class="hero-badges">
        <div class="hero-badge">
          <i class="pi pi-check-circle"></i>
          <span>{{ activeExam?.totalQuizzes }} {{ isPt ? 'Simulados Completos' : 'Full Exams' }}</span>
        </div>
        <div class="hero-badge">
          <i class="pi pi-file"></i>
          <span>{{ activeExam?.totalQuestions }} {{ isPt ? 'Questões no Total' : 'Questions Total' }}</span>
        </div>
        <div class="hero-badge">
          <i class="pi pi-compass"></i>
          <span>{{ activeExam?.domainsCount }} {{ isPt ? 'Domínios do Blueprint' : 'Blueprint Domains' }}</span>
        </div>
        <div class="hero-badge">
          <i class="pi pi-clock"></i>
          <span>{{ activeExam?.durationMinutes }} min ({{ isPt ? 'Temporizador' : 'Timer' }})</span>
        </div>
      </div>
    </div>

    <!-- Mode Selection -->
    <section class="section-container">
      <h3 class="section-title">
        <span class="step-num">1</span>
        <span>{{ isPt ? 'Escolha a Modalidade de Realização' : 'Select Examination Mode' }}</span>
      </h3>

      <div class="mode-grid">
        <!-- Modo Estudo -->
        <div 
          class="mode-card"
          :class="{ selected: store.selectedMode === 'simulado' }"
          @click="store.selectedMode = 'simulado'"
        >
          <span class="mode-badge simulado">{{ isPt ? 'Modo Estudo' : 'Study Mode' }}</span>
          <h4>{{ isPt ? 'Modo Simulado (Treinamento)' : 'Practice Mode (Training)' }}</h4>
          <p>{{ isPt ? 'Ideal para estudo diário, revisão ativa e aprendizado contínuo.' : 'Best for daily study, active recall, and continuous learning.' }}</p>
          <ul class="mode-features">
            <li><i class="pi pi-save text-primary"></i> <span><strong>{{ isPt ? 'Salva progresso:' : 'Save progress:' }}</strong> {{ isPt ? 'Pause e retome a qualquer momento.' : 'Pause and resume anytime.' }}</span></li>
            <li><i class="pi pi-lightbulb text-warning"></i> <span><strong>{{ isPt ? 'Dicas ativadas:' : 'Hints enabled:' }}</strong> {{ isPt ? 'Pistas arquiteturais em dúvidas.' : 'Architectural clues when in doubt.' }}</span></li>
            <li><i class="pi pi-book text-info"></i> <span><strong>{{ isPt ? 'Feedback imediato:' : 'Immediate feedback:' }}</strong> {{ isPt ? 'Gabarito e justificativas na hora.' : 'Answers and rationales on demand.' }}</span></li>
          </ul>
        </div>

        <!-- Modo Exame -->
        <div 
          class="mode-card"
          :class="{ selected: store.selectedMode === 'exame' }"
          @click="store.selectedMode = 'exame'"
        >
          <span class="mode-badge exame">{{ isPt ? 'Modo Real' : 'Real Exam' }}</span>
          <h4>{{ isPt ? 'Modo Exame (Certificação)' : 'Exam Mode (Simulation)' }}</h4>
          <p>{{ isPt ? 'Simulação fiel ao formato do exame oficial de certificação Google Cloud.' : 'Realistic simulation matching Google Cloud certification exam conditions.' }}</p>
          <ul class="mode-features">
            <li><i class="pi pi-hourglass text-danger"></i> <span><strong>{{ isPt ? 'Temporizador de 120 minutos:' : '120-min countdown:' }}</strong> {{ isPt ? 'Contagem regressiva rígida.' : 'Strict timed session.' }}</span></li>
            <li><i class="pi pi-ban text-secondary"></i> <span><strong>{{ isPt ? 'Não salva progresso:' : 'No saving:' }}</strong> {{ isPt ? 'Sem pausa no meio do exame.' : 'Must finish in single sitting.' }}</span></li>
            <li><i class="pi pi-chart-line text-success"></i> <span><strong>{{ isPt ? 'Critério de Referência:' : 'Benchmark:' }}</strong> {{ isPt ? 'Meta recomendada de 70% de acerto.' : '70% recommended target score.' }}</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Quizzes Grid Section -->
    <section class="section-container">
      <div class="section-header-row">
        <h3 class="section-title">
          <span class="step-num">2</span>
          <span>{{ isPt ? 'Escolha o Simulado' : 'Select Practice Quiz' }}</span>
        </h3>
        <span class="exam-status-tag" :class="activeExam?.status === 'active' ? 'active' : 'coming-soon'">
          <i :class="activeExam?.status === 'active' ? 'pi pi-check' : 'pi pi-clock'"></i>
          <span>{{ activeExam?.status === 'active' ? (isPt ? 'Simulados Disponíveis' : 'Available') : (isPt ? 'Em Desenvolvimento' : 'In Development') }}</span>
        </span>
      </div>

      <!-- Notice when track is in development -->
      <div v-if="activeExam?.status === 'coming_soon'" class="track-status-banner">
        <div class="banner-icon">
          <i class="pi pi-compass"></i>
        </div>
        <div class="banner-body">
          <h4>{{ isPt ? 'Trilha em Fase de Curadoria de Questões' : 'Track in Question Curation Phase' }}</h4>
          <p>
            {{ isPt 
              ? `Os simulados para ${activeExam?.name} (${activeExam?.code}) estão em fase de revisão técnica. Você já pode consultar as seções e pesos do Blueprint oficial logo abaixo ou alternar para o Professional Cloud Architect (PCA) com 420 questões ativas.` 
              : `The quizzes for ${activeExam?.name} (${activeExam?.code}) are in technical review. You can inspect the blueprint domain weights below or switch to PCA (420 questions ready).` 
            }}
          </p>
        </div>
        <button class="btn btn-switch-pca" @click="store.selectExam('gcp-pca')">
          <i class="pi pi-arrow-left"></i>
          <span>{{ isPt ? 'Ir para PCA (420Q)' : 'Go to PCA (420Q)' }}</span>
        </button>
      </div>

      <div class="quizzes-grid">
        <div 
          v-for="quiz in currentQuizzes" 
          :key="quiz.id"
          class="quiz-card"
          :class="{ 'is-coming-soon': isQuizComingSoon(quiz) }"
        >
          <div class="quiz-card-header">
            <h4>{{ quiz.title }}</h4>
            <span v-if="isQuizComingSoon(quiz)" class="badge-coming-soon">
              <i class="pi pi-clock"></i>
              <span>{{ isPt ? 'Em Breve' : 'Coming Soon' }}</span>
            </span>
            <span v-else class="quiz-badge-count">
              {{ quiz.questionCount || 60 }} {{ isPt ? 'Questões' : 'Questions' }}
            </span>
          </div>

          <div class="quiz-card-body">
            <p>{{ quiz.description }}</p>

            <!-- Distribution pills -->
            <div v-if="quiz.sectionDistribution" class="section-pill-list">
              <span 
                v-for="(count, secId) in quiz.sectionDistribution" 
                :key="secId"
                class="section-pill"
                :style="{ backgroundColor: getSectionColor(secId) }"
                :title="getSectionName(secId)"
              >
                Sec {{ secId }}: {{ count }}
              </span>
            </div>

            <!-- Saved Progress Banner -->
            <div v-if="!isQuizComingSoon(quiz) && getSavedProgress(quiz.id)" class="saved-progress-banner">
              <span>
                <i class="pi pi-save"></i>
                <span>{{ isPt ? 'Progresso salvo:' : 'Saved progress:' }}</span>
                <strong>{{ getSavedAnsweredCount(quiz.id) }}/{{ quiz.questionCount || 60 }}</strong>
              </span>
              <button 
                class="btn-discard" 
                @click="discardSavedProgress(quiz.id)"
              >
                {{ isPt ? 'Descartar' : 'Discard' }}
              </button>
            </div>
          </div>

          <div class="quiz-card-footer">
            <template v-if="isQuizComingSoon(quiz)">
              <Button 
                :label="isPt ? 'Trilha em Desenvolvimento' : 'Track in Development'" 
                severity="secondary" 
                outlined 
                disabled 
                class="w-full" 
              />
            </template>
            <template v-else-if="getSavedProgress(quiz.id)">
              <div class="saved-action-group">
                <Button 
                  :label="isPt ? 'Retomar Simulado' : 'Resume Quiz'" 
                  icon="pi pi-play" 
                  severity="primary" 
                  class="flex-1"
                  @click="handleStartQuiz(quiz.id, true)"
                />
                <Button 
                  :label="isPt ? 'Reiniciar' : 'Restart'" 
                  severity="secondary" 
                  outlined 
                  @click="handleStartQuiz(quiz.id, false)"
                />
              </div>
            </template>
            <template v-else>
              <Button 
                :label="isPt ? 'Iniciar Simulado' : 'Start Exam'" 
                icon="pi pi-play" 
                severity="primary" 
                class="w-full"
                @click="handleStartQuiz(quiz.id, false)"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Domain Blueprint Table -->
    <section class="section-container guide-accordion">
      <div class="guide-header">
        <i class="pi pi-list-check text-primary"></i>
        <h4>{{ isPt ? 'Referência: Distribuição de Pesos do Guia de Exame' : 'Reference: Exam Blueprint Domain Weights' }} ({{ activeExam?.code }})</h4>
      </div>
      <p class="guide-sub">{{ isPt ? 'Todas as questões estão categorizadas e avaliadas com base nestas seções oficiais:' : 'All questions are weighted and mapped to these official guide domains:' }}</p>

      <div class="table-responsive">
        <table class="guide-table">
          <thead>
            <tr>
              <th>{{ isPt ? 'Seção' : 'Section' }}</th>
              <th>{{ isPt ? 'Domínio Arquitetural' : 'Architectural Domain' }}</th>
              <th>{{ isPt ? 'Peso Estimado' : 'Blueprint Weight' }}</th>
              <th>{{ isPt ? 'Foco Principal' : 'Key Focus' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sec, secId) in store.quizDatabase?.sections || activeExam?.sections || {}" :key="secId">
              <td><strong>{{ isPt ? 'Seção' : 'Section' }} {{ secId }}</strong></td>
              <td>
                <span class="domain-dot" :style="{ backgroundColor: sec.color || '#1a73e8' }"></span>
                <span>{{ isPt && sec.name_pt ? sec.name_pt : sec.name }}</span>
              </td>
              <td><strong>{{ sec.weight || '~20%' }}</strong></td>
              <td>{{ sec.focus || sec.shortName || (isPt ? 'Alinhado ao guia oficial' : 'Official guide blueprint') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';

const store = useQuizStore();
const toast = useToast();
const confirm = useConfirm();

const isPt = computed(() => store.uiLanguage === 'pt');
const activeExam = computed(() => store.activeExam);

const currentQuizzes = computed(() => {
  if (store.quizDatabase?.quizzes && store.quizDatabase.quizzes.length > 0) {
    return store.quizDatabase.quizzes;
  }
  if (activeExam.value) {
    return Array.from({ length: activeExam.value.totalQuizzes || 5 }, (_, i) => ({
      id: i + 1,
      title: `${isPt.value ? 'Simulado' : 'Practice Quiz'} ${i + 1} (${activeExam.value.code})`,
      description: isPt.value 
        ? `Simulado de 60 questões alinhado aos domínios do exame ${activeExam.value.shortName}.` 
        : `60-question simulation aligned to ${activeExam.value.shortName} blueprint domains.`,
      questionCount: 60,
      comingSoon: activeExam.value.status === 'coming_soon'
    }));
  }
  return [];
});

function isQuizComingSoon(quiz) {
  return Boolean(quiz.comingSoon || activeExam.value?.status === 'coming_soon');
}

function getSectionColor(secId) {
  return store.quizDatabase?.sections?.[secId]?.color || '#1a73e8';
}

function getSectionName(secId) {
  const sec = store.quizDatabase?.sections?.[secId];
  if (!sec) return `Sec ${secId}`;
  return isPt.value && sec.name_pt ? sec.name_pt : sec.name;
}

function getSavedProgress(quizId) {
  const key = `${store.activeExamId}_saved_simulado_${quizId}`;
  const raw = localStorage.getItem(key) || (store.activeExamId === 'gcp-pca' ? localStorage.getItem(`gcp_pca_saved_simulado_${quizId}`) : null);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function getSavedAnsweredCount(quizId) {
  const saved = getSavedProgress(quizId);
  return saved?.userAnswers ? Object.keys(saved.userAnswers).length : 0;
}

function discardSavedProgress(quizId) {
  confirm.require({
    message: isPt.value ? 'Deseja descartar o progresso salvo deste simulado?' : 'Discard saved progress for this exam?',
    header: isPt.value ? 'Descartar Progresso' : 'Discard Progress',
    icon: 'pi pi-trash',
    accept: async () => {
      await store.clearSavedProgress(quizId);
      toast.add({
        severity: 'info',
        summary: isPt.value ? 'Progresso Descartado' : 'Progress Discarded',
        detail: isPt.value ? 'O progresso salvo foi removido.' : 'Saved progress discarded.',
        life: 3000
      });
    }
  });
}

async function handleStartQuiz(quizId, resume) {
  try {
    await store.startQuiz(quizId, resume);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: err.message,
      life: 4000
    });
  }
}
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box !important;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem 1.25rem;
  overflow-x: hidden;
}

/* Hero Banner */
.hero-banner {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  background: linear-gradient(135deg, rgba(26, 115, 232, 0.08) 0%, rgba(66, 133, 244, 0.02) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem;
  margin-bottom: 2rem;
}

.hero-banner h2 {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

.hero-banner p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 820px;
  margin-bottom: 1.25rem;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.hero-badge i {
  color: var(--primary);
  font-size: 0.85rem;
}

/* Sections */
.section-container {
  margin-bottom: 2.25rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
}

/* Mode Selection */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.mode-card {
  box-sizing: border-box !important;
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.mode-card.selected {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 1px var(--primary);
}

.mode-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 0.65rem;
}

.mode-badge.simulado {
  background: var(--success-light);
  color: var(--success);
}

.mode-badge.exame {
  background: var(--error-light);
  color: var(--error);
}

.mode-card h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.mode-card p {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 0.85rem;
}

.mode-features {
  list-style: none;
  font-size: 0.82rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mode-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Quizzes Grid */
.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.15rem;
}

.quiz-card {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.quiz-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

.quiz-card.is-coming-soon {
  border-style: dashed;
  opacity: 0.9;
}

.quiz-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
}

.quiz-card-header h4 {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
  min-width: 0;
  margin-right: 0.5rem;
  word-wrap: break-word;
}

.quiz-badge-count {
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--bg-subtle);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  color: var(--text-secondary);
}

.badge-coming-soon {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(147, 52, 232, 0.12);
  color: #9334e8;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
}

.quiz-card-body p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 0.85rem;
}

.section-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

.section-pill {
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.saved-progress-banner {
  background: var(--primary-light);
  border: 1px solid rgba(26, 115, 232, 0.25);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.65rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  margin-bottom: 0.85rem;
}

.saved-progress-banner span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-discard {
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--error);
  font-size: 0.72rem;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  cursor: pointer;
}

.quiz-card-footer {
  margin-top: 1rem;
}

.saved-action-group {
  display: flex;
  gap: 0.4rem;
}

/* Guide Accordion */
.guide-accordion {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.guide-header h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.guide-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 100%;
}

.guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
  min-width: 520px;
}

.guide-table th,
.guide-table td {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}

.guide-table th {
  background: var(--bg-subtle);
  font-weight: 700;
  color: var(--text-primary);
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.section-header-row .section-title {
  margin-bottom: 0;
}

.exam-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.exam-status-tag.active {
  background: rgba(52, 168, 83, 0.12);
  color: #1e8e3e;
}

.exam-status-tag.coming-soon {
  background: rgba(242, 153, 0, 0.12);
  color: #b06000;
}

.track-status-banner {
  background: var(--bg-surface);
  border: 1.5px dashed var(--warning);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.banner-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(249, 171, 0, 0.15);
  color: #b06000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.banner-body {
  flex: 1;
}

.banner-body h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.banner-body p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.btn-switch-pca {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.2s;
}

.btn-switch-pca:hover {
  background: var(--primary-hover);
}

@media (max-width: 768px) {
  .track-status-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.85rem;
  }
  .btn-switch-pca {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem 0.85rem 2.5rem 0.85rem;
    overflow-x: hidden;
  }
  .hero-banner {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
    padding: 1.25rem 1rem;
    overflow: hidden;
  }
  .hero-banner h2 {
    font-size: 1.25rem;
  }
  .mode-grid {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .mode-card {
  box-sizing: border-box !important;
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
    width: 100%;
    box-sizing: border-box;
  }
  .quizzes-grid {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .quiz-card {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
    width: 100%;
    box-sizing: border-box;
  }
  .saved-action-group {
    flex-direction: column;
  }
}
</style>
