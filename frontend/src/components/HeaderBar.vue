<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Brand Logo -->
      <div class="logo-group" @click="handleLogoClick" title="Voltar para a página inicial">
        <div class="logo-icon">
          <svg class="brand-svg-logo" viewBox="0 0 48 48" width="30" height="30" aria-label="GCP Prep Logo" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vueHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1a73e8" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#0d47a1" stop-opacity="0.08" />
              </linearGradient>
            </defs>
            <polygon points="24,3 44,14 44,34 24,45 4,34 4,14" fill="url(#vueHexGrad)" stroke="#1a73e8" stroke-width="2.2" stroke-linejoin="round"/>
            <line x1="14" y1="29" x2="24" y2="16" stroke="#8ab4f8" stroke-width="1.8" stroke-dasharray="2 2"/>
            <line x1="34" y1="29" x2="24" y2="16" stroke="#8ab4f8" stroke-width="1.8" stroke-dasharray="2 2"/>
            <circle cx="24" cy="16" r="3.6" fill="#1a73e8"/>
            <circle cx="14" cy="29" r="3" fill="#34a853"/>
            <circle cx="34" cy="29" r="3" fill="#ea4335"/>
          </svg>
        </div>
        <div class="logo-text">
          <h1>
            <span class="logo-full">GCP Certification Prep</span>
            <span class="logo-short">GCP Prep</span>
          </h1>
          <p v-if="activeExam && store.currentScreen !== 'quiz'" class="logo-subtitle">{{ activeExam.shortName }}</p>
        </div>
      </div>

      <!-- QUIZ MODE: Focused Navbar Layout -->
      <template v-if="store.currentScreen === 'quiz'">
        <!-- Track Pill Badge -->
        <span 
          class="quiz-track-badge"
          :style="{ 
            color: activeExam?.badgeColor || '#1a73e8',
            backgroundColor: `${activeExam?.badgeColor || '#1a73e8'}15` 
          }"
        >
          {{ activeExam?.code || 'GCP' }}
        </span>

        <!-- Timer in Header -->
        <div class="timer-badge" :class="{ urgent: isUrgent }">
          <i class="pi pi-clock"></i>
          <span>{{ store.timeDisplay }}</span>
        </div>

        <!-- Quiz Quick Actions (Lang toggle & Exit button) -->
        <div class="quiz-nav-actions">
          <button 
            class="lang-pill-btn" 
            @click="toggleLang"
            :title="store.uiLanguage === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'"
          >
            <span>{{ store.uiLanguage.toUpperCase() }}</span>
          </button>

          <button 
            class="btn-quiz-exit" 
            @click="handleLogoClick"
            :title="store.uiLanguage === 'pt' ? 'Pausar / Sair do Simulado' : 'Pause / Exit Quiz'"
          >
            <i class="pi pi-times"></i>
            <span class="exit-label">{{ store.uiLanguage === 'pt' ? 'Sair' : 'Exit' }}</span>
          </button>
        </div>
      </template>

      <!-- DASHBOARD & RESULTS MODE: Standard Header Actions -->
      <template v-else>
        <div class="header-actions">
          <!-- Exam Switcher Pill Button -->
          <button 
            v-if="store.isAuthenticated"
            class="btn-exam-selector" 
            @click="store.currentView = 'exam-selection'"
            title="Alternar Trilha de Exame Google Cloud"
          >
            <span 
              class="exam-badge-tag"
              :style="{ 
                color: activeExam?.badgeColor || '#1a73e8',
                backgroundColor: `${activeExam?.badgeColor || '#1a73e8'}18` 
              }"
            >
              {{ activeExam?.code || 'GCP' }}
            </span>
            <span class="exam-btn-title">{{ activeExam?.shortName || 'Selecione' }}</span>
            <i class="pi pi-chevron-down exam-chevron"></i>
          </button>

          <!-- Language Toggle Button -->
          <button 
            class="lang-pill-btn" 
            @click="toggleLang"
            :title="store.uiLanguage === 'pt' ? 'Mudar idioma para Inglês' : 'Switch language to Portuguese'"
          >
            <span>{{ store.uiLanguage.toUpperCase() }}</span>
          </button>

          <!-- Dark Mode Toggle -->
          <button 
            class="btn-icon" 
            @click="store.toggleTheme()" 
            :title="store.isDarkMode ? 'Modo Claro' : 'Modo Escuro'"
          >
            <i :class="store.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>

          <!-- User Profile Pill -->
          <div v-if="store.currentUser" class="user-profile-badge">
            <img 
              :src="store.currentUser.picture || defaultAvatar" 
              class="user-avatar" 
              alt="Avatar" 
            />
            <span class="user-name">{{ store.currentUser.name || 'Usuário' }}</span>
            <button class="btn-logout" @click="handleLogout" title="Sair da Conta">
              <i class="pi pi-sign-out"></i>
            </button>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { useConfirm } from 'primevue/useconfirm';

const store = useQuizStore();
const confirm = useConfirm();

const activeExam = computed(() => store.activeExam);
const isUrgent = computed(() => store.selectedMode === 'exame' && store.timeRemaining < 600);
const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234285F4"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3C/svg%3E';

function toggleLang() {
  const nextLang = store.uiLanguage === 'pt' ? 'en' : 'pt';
  store.setUILanguage(nextLang);
  store.setQuestionLanguage(nextLang);
}

function handleLogoClick() {
  if (store.currentScreen === 'quiz') {
    confirm.require({
      message: store.selectedMode === 'exame' 
        ? (store.uiLanguage === 'pt' ? 'No Modo Exame o progresso não é salvo. Deseja sair?' : 'Exam mode progress is not saved. Return to dashboard?')
        : (store.uiLanguage === 'pt' ? 'Seu progresso foi salvo. Deseja voltar ao início?' : 'Progress saved. Return to dashboard?'),
      header: store.uiLanguage === 'pt' ? 'Voltar ao Início' : 'Return to Dashboard',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        store.stopTimer();
        store.currentScreen = 'dashboard';
      }
    });
  } else if (store.currentScreen === 'results') {
    store.currentScreen = 'dashboard';
  }
}

function handleLogout() {
  confirm.require({
    message: store.uiLanguage === 'pt' ? 'Deseja encerrar sua sessão atual?' : 'Do you want to log out?',
    header: store.uiLanguage === 'pt' ? 'Sair da Conta' : 'Sign Out',
    icon: 'pi pi-sign-out',
    accept: () => {
      store.logout();
    }
  });
}
</script>

<style scoped>
.app-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.55rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Logo Group */
.logo-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.15;
  margin: 0;
}

.logo-short {
  display: none;
}

.logo-subtitle {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1;
  margin-top: 2px;
}

/* Quiz-Focused Mode Navbar */
.quiz-track-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}

.timer-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.85rem;
  background: var(--bg-subtle);
  color: var(--primary);
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
}

.timer-badge.urgent {
  background: var(--error-light);
  color: var(--error);
  border-color: var(--error);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.04); }
}

.quiz-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-quiz-exit {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-quiz-exit:hover {
  background: var(--error-light);
  color: var(--error);
  border-color: var(--error);
}

/* Standard Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-exam-selector {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.65rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-exam-selector:hover {
  border-color: var(--primary);
}

.exam-badge-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.exam-btn-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exam-chevron {
  font-size: 0.65rem;
  color: var(--text-secondary);
}

.lang-pill-btn {
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-subtle);
  color: var(--text-primary);
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-icon {
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.85rem;
}

.btn-icon:hover {
  color: var(--primary);
}

.user-profile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: 999px;
}

.user-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.75rem;
  font-weight: 600;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  padding: 2px;
}

.btn-logout:hover {
  color: var(--error);
}

/* Ultra-Responsive Mobile Rules */
@media (max-width: 640px) {
  .header-container {
    padding: 0.45rem 0.75rem;
  }

  .logo-full {
    display: none;
  }

  .logo-short {
    display: inline;
  }

  .logo-subtitle {
    display: none;
  }

  .exam-btn-title {
    display: none;
  }

  .user-name {
    display: none;
  }

  .exit-label {
    display: none;
  }
}

@media (max-width: 380px) {
  .logo-short {
    display: none;
  }
}
</style>
