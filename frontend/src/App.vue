<template>
  <div class="app-shell" :class="quizStore.theme">
    <!-- Header Navigation -->
    <HeaderBar />

    <!-- Main Content Area -->
    <main class="main-content">
      <template v-if="!quizStore.isAuthenticated && quizStore.currentScreen !== 'legal-about'">
        <LoginView />
      </template>
      <template v-else>
        <LegalAboutView v-if="quizStore.currentScreen === 'legal-about'" />
        <DashboardView v-else-if="quizStore.currentScreen === 'dashboard'" />
        <QuizView v-else-if="quizStore.currentScreen === 'quiz'" />
        <ResultsView v-else-if="quizStore.currentScreen === 'results'" />
        <ExamSelectionView v-else-if="quizStore.currentScreen === 'exam-selection'" />
      </template>
    </main>

    <!-- PrimeVue Global Overlays -->
    <Toast position="bottom-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useQuizStore } from './stores/quizStore.js';

import HeaderBar from './components/HeaderBar.vue';
import DashboardView from './components/DashboardView.vue';
import QuizView from './components/QuizView.vue';
import ResultsView from './components/ResultsView.vue';
import LoginView from './components/LoginView.vue';
import ExamSelectionView from './components/ExamSelectionView.vue';
import LegalAboutView from './components/LegalAboutView.vue';

import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

const quizStore = useQuizStore();

onMounted(async () => {
  quizStore.initAuth();
  await quizStore.fetchExams();
  await quizStore.fetchQuizzes();
});
</script>

<style>
.app-shell {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box !important;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-ground);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box !important;
  min-width: 0;
}

/* Custom PrimeVue ConfirmDialog styling for mobile */
@media (max-width: 600px) {
  .p-confirmdialog {
    width: 90% !important;
    max-width: 360px !important;
    border-radius: 18px !important;
  }
}
</style>
