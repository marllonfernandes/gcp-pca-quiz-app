<template>
  <div class="exam-selection-view">
    <div class="view-header">
      <button class="btn-back" @click="goBack">
        <i class="pi pi-arrow-left"></i>
        <span>{{ isPt ? 'Voltar ao Dashboard' : 'Back to Dashboard' }}</span>
      </button>
      <div class="titles">
        <span class="eyebrow">GOOGLE CLOUD CERTIFICATION TRACKS</span>
        <h2>{{ isPt ? 'Trilhas de Certificação Google Cloud' : 'Google Cloud Certification Tracks' }}</h2>
        <p>{{ isPt ? 'Alterne entre os exames oficiais para acessar simulados, questões comentadas e métricas por domínio.' : 'Switch between certification tracks to access practice quizzes and domain blueprints.' }}</p>
      </div>
    </div>

    <div class="tracks-container">
      <div class="tracks-grid">
        <div 
          v-for="exam in store.examsCatalog" 
          :key="exam.id"
          class="track-card"
          :class="{ active: exam.id === store.activeExamId }"
          @click="selectTrack(exam.id)"
        >
          <!-- Card Header Badges -->
          <div class="track-card-top">
            <span 
              class="level-badge"
              :class="exam.level === 'Associate' ? 'associate' : 'professional'"
            >
              {{ exam.level }}
            </span>

            <span 
              class="status-badge"
              :class="exam.status === 'active' ? 'active' : 'coming-soon'"
            >
              <i :class="exam.status === 'active' ? 'pi pi-check-circle' : 'pi pi-clock'"></i>
              <span>
                {{ exam.status === 'active' 
                  ? (isPt ? `Disponível (${exam.totalQuizzes})` : `Available (${exam.totalQuizzes})`) 
                  : (isPt ? 'Em Breve' : 'Coming Soon') 
                }}
              </span>
            </span>
          </div>

          <!-- Title & Description -->
          <div class="track-info">
            <div class="track-title-row">
              <span 
                class="track-code-pill"
                :style="{ backgroundColor: `${exam.badgeColor || '#1a73e8'}18`, color: exam.badgeColor || '#1a73e8' }"
              >
                {{ exam.code }}
              </span>
              <h4>{{ isPt && exam.name_pt ? exam.name_pt : exam.name }}</h4>
            </div>
            <p class="track-desc">{{ isPt ? exam.description : (exam.description_en || exam.description) }}</p>
          </div>

          <!-- Metadata chips -->
          <div class="track-meta">
            <div class="meta-item">
              <i class="pi pi-list"></i>
              <span><strong>{{ exam.totalQuizzes }}</strong> {{ isPt ? 'Simulados' : 'Quizzes' }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-file"></i>
              <span><strong>{{ exam.totalQuestions }}</strong> {{ isPt ? 'Questões' : 'Questions' }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-compass"></i>
              <span><strong>{{ exam.domainsCount }}</strong> {{ isPt ? 'Domínios' : 'Domains' }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-clock"></i>
              <span><strong>{{ exam.durationMinutes }}</strong> min</span>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="track-footer">
            <button 
              class="btn-track-action"
              :class="exam.id === store.activeExamId ? 'active-track' : 'select-track'"
              :disabled="exam.id === store.activeExamId"
            >
              <i :class="exam.id === store.activeExamId ? 'pi pi-check' : 'pi pi-arrow-right'"></i>
              <span>{{ exam.id === store.activeExamId ? (isPt ? 'Trilha Selecionada' : 'Active Track') : (isPt ? 'Selecionar Trilha' : 'Select Track') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { useToast } from 'primevue/usetoast';

const store = useQuizStore();
const toast = useToast();
const isPt = computed(() => store.uiLanguage === 'pt');

function goBack() {
  store.currentScreen = 'dashboard';
}

async function selectTrack(examId) {
  if (examId === store.activeExamId) {
    store.currentScreen = 'dashboard';
    return;
  }

  await store.selectExam(examId);
  const selected = store.examsCatalog.find(e => e.id === examId);

  toast.add({
    severity: 'info',
    summary: isPt.value ? 'Trilha Alterada' : 'Track Changed',
    detail: isPt.value 
      ? `Você agora está visualizando a trilha ${selected?.shortName || examId}.`
      : `You are now on the ${selected?.shortName || examId} track.`,
    life: 3000
  });
  
  store.currentScreen = 'dashboard';
}
</script>

<style scoped>
.exam-selection-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.view-header {
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-back:hover {
  text-decoration: underline;
}

.titles {
  text-align: left;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.8px;
  display: block;
  margin-bottom: 0.4rem;
}

.titles h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}

.titles p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.5;
  max-width: 800px;
}

.tracks-container {
  width: 100%;
}

/* Responsive Grid for Tracks */
.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  padding: 0.5rem 0 2rem 0;
}

@media (max-width: 640px) {
  .exam-selection-view {
    padding: 1rem;
  }
  .titles h2 {
    font-size: 1.4rem;
  }
  .tracks-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.track-card {
  border: 1.5px solid var(--border-color);
  background: var(--bg-surface);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.track-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.track-card:active {
  transform: scale(0.985);
}

.track-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 0 0 1.5px var(--primary);
}

.track-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.level-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  letter-spacing: 0.5px;
}

.level-badge.professional {
  background: rgba(26, 115, 232, 0.12);
  color: #1a73e8;
}

.level-badge.associate {
  background: rgba(52, 168, 83, 0.12);
  color: #1e8e3e;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.status-badge.active {
  background: rgba(52, 168, 83, 0.15);
  color: #1e8e3e;
}

.status-badge.coming-soon {
  background: rgba(242, 153, 0, 0.15);
  color: #b06000;
}

.track-title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.track-code-pill {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  margin-top: 2px;
}

.track-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}

.track-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  min-height: 2.8em;
}

.track-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.meta-item i {
  font-size: 0.85rem;
  color: var(--primary);
  opacity: 0.85;
}

.btn-track-action {
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.select-track {
  background: var(--primary);
  color: #ffffff;
}

.select-track:hover {
  background: var(--primary-hover);
}

.active-track {
  background: var(--bg-surface);
  color: var(--primary);
  border: 1.5px solid var(--primary);
  cursor: default;
}
</style>
