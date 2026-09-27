<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- Brand Logo & Header -->
      <div class="login-header">
        <div class="brand-avatar">
          <svg class="brand-svg" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#1a73e8"/>
            <path d="M12 28L20 12L28 28H12Z" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="20" cy="22" r="3" fill="#fbbc04"/>
          </svg>
        </div>
        <h1 class="login-title">Cloud Cert Prep</h1>
        <p class="login-subtitle">
          {{ quizStore.lang === 'pt' 
            ? 'Plataforma de alta precisão para certificações Google Cloud.' 
            : 'High-precision study platform for Google Cloud certifications.' }}
        </p>
      </div>

      <!-- Certifications Badge Row -->
      <div class="cert-pills">
        <span class="cert-pill">PCA</span>
        <span class="cert-pill">ACE</span>
        <span class="cert-pill">PDE</span>
        <span class="cert-pill">PCSE</span>
        <span class="cert-pill">DevOps</span>
      </div>

      <!-- Feature Bullets -->
      <div class="login-features">
        <div class="feature-item">
          <i class="pi pi-check-circle text-green"></i>
          <span>{{ quizStore.lang === 'pt' ? '420+ questões com justificativas arquiteturais' : '420+ questions with architectural rationales' }}</span>
        </div>
        <div class="feature-item">
          <i class="pi pi-stopwatch text-blue"></i>
          <span>{{ quizStore.lang === 'pt' ? 'Modo Estudo e Modo Exame com cronômetro real' : 'Study and Timed Exam simulation modes' }}</span>
        </div>
        <div class="feature-item">
          <i class="pi pi-chart-line text-purple"></i>
          <span>{{ quizStore.lang === 'pt' ? 'Métricas detalhadas por domínio do Blueprint' : 'Detailed metrics aligned to exam blueprints' }}</span>
        </div>
      </div>

      <!-- Sign In Section -->
      <div class="login-actions">
        <!-- Error Message -->
        <div v-if="authError" class="auth-error-banner">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ authError }}</span>
        </div>

        <!-- Google Sign-In Container rendered by GIS -->
        <div class="google-btn-wrapper">
          <div id="google-signin-btn-container" class="google-btn-container"></div>
          
          <!-- Loading state if Google script is fetching -->
          <div v-if="isGoogleLoading && !isGoogleReady" class="google-btn-placeholder">
            <i class="pi pi-spin pi-spinner"></i>
            <span>{{ quizStore.lang === 'pt' ? 'Carregando login seguro Google...' : 'Loading Google sign in...' }}</span>
          </div>

          <!-- Fallback direct button if script blocked or iframe delay -->
          <button 
            v-if="!isGoogleReady && !isGoogleLoading" 
            class="btn btn-google-fallback" 
            @click="triggerGoogleLogin"
          >
            <svg class="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{{ quizStore.lang === 'pt' ? 'Fazer login com o Google' : 'Sign in with Google' }}</span>
          </button>
        </div>

        <!-- Dev Mode Fallback / Quick Access -->
        <div class="dev-login-section">
          <div class="divider">
            <span>{{ quizStore.lang === 'pt' ? 'ou para testes' : 'or for testing' }}</span>
          </div>
          <button class="btn btn-dev-login" @click="handleDevLogin">
            <i class="pi pi-user"></i>
            <span>{{ quizStore.lang === 'pt' ? 'Entrar no Modo Visitante / Dev' : 'Enter as Guest / Dev' }}</span>
          </button>
        </div>
      </div>

      <!-- Legal & Fair Use Notice Footer -->
      <div class="login-footer">
        <p class="fair-use-disclaimer">
          {{ quizStore.lang === 'pt'
            ? 'Ferramenta educacional independente. Não afiliada nem endossada pela Google LLC. Google Cloud® é marca registrada.'
            : 'Independent educational simulator. Not affiliated with or endorsed by Google LLC. Google Cloud® is a registered trademark.' }}
        </p>
        <div class="footer-links">
          <a href="#" @click.prevent="openLegal('terms')">{{ quizStore.lang === 'pt' ? 'Termos de Uso' : 'Terms' }}</a>
          <span>•</span>
          <a href="#" @click.prevent="openLegal('privacy')">{{ quizStore.lang === 'pt' ? 'Privacidade (LGPD)' : 'Privacy' }}</a>
          <span>•</span>
          <a href="#" @click.prevent="openLegal('disclaimer')">{{ quizStore.lang === 'pt' ? 'Aviso Legal' : 'Disclaimer' }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useQuizStore } from '../stores/quizStore.js';

const quizStore = useQuizStore();

const isGoogleReady = ref(false);
const isGoogleLoading = ref(true);
const authError = ref('');
let pollInterval = null;

function handleDevLogin() {
  quizStore.devLogin();
}

function openLegal(tab) {
  quizStore.activeLegalTab = tab;
  quizStore.currentView = 'legal-about';
}

async function initGoogleSignIn() {
  isGoogleLoading.value = true;
  authError.value = '';

  // 1. Fetch Client ID if not yet available
  let clientId = quizStore.googleClientId;
  if (!clientId) {
    clientId = await quizStore.fetchAuthConfig();
  }

  if (!clientId) {
    isGoogleLoading.value = false;
    console.warn('[LoginView] Nenhum Google Client ID configurado no backend.');
    return;
  }

  // 2. Poll for Google Identity Services SDK
  let attempts = 0;
  const maxAttempts = 30; // 30 * 200ms = 6s

  pollInterval = setInterval(() => {
    attempts++;
    if (window.google?.accounts?.id) {
      clearInterval(pollInterval);
      pollInterval = null;
      renderGoogleButton(clientId);
    } else if (attempts >= maxAttempts) {
      clearInterval(pollInterval);
      pollInterval = null;
      isGoogleLoading.value = false;
      console.warn('[LoginView] Google Identity Services script timeout.');
    }
  }, 200);
}

function renderGoogleButton(clientId) {
  const container = document.getElementById('google-signin-btn-container');
  if (!container || !window.google?.accounts?.id) return;

  try {
    // Initialize GIS Client
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          if (!response || !response.credential) {
            throw new Error('Nenhuma credencial recebida do Google.');
          }
          await quizStore.loginWithGoogle(response.credential);
        } catch (err) {
          authError.value = err.message || 'Falha ao autenticar com Google.';
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Render the Official Google Button
    container.innerHTML = '';
    window.google.accounts.id.renderButton(container, {
      theme: quizStore.theme === 'dark' ? 'filled_black' : 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'signin_with',
      width: 280,
      logo_alignment: 'left'
    });

    isGoogleReady.value = true;
    isGoogleLoading.value = false;
  } catch (err) {
    console.error('[LoginView] Erro ao renderizar botão Google:', err);
    isGoogleLoading.value = false;
  }
}

function triggerGoogleLogin() {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.prompt();
  } else {
    // Se bloqueado por adblocker ou rede, recorrer ao login dev/visitante
    handleDevLogin();
  }
}

// Watch theme changes to re-render button with proper contrast
watch(() => quizStore.theme, () => {
  if (isGoogleReady.value && quizStore.googleClientId) {
    renderGoogleButton(quizStore.googleClientId);
  }
});

onMounted(() => {
  initGoogleSignIn();
});

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
});
</script>

<style scoped>
.login-wrapper {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 24px;
  padding: 2.2rem 1.8rem;
  box-shadow: 0 12px 36px -8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-header {
  text-align: center;
}

.brand-avatar {
  display: inline-flex;
  margin-bottom: 0.8rem;
}

.brand-svg {
  width: 48px;
  height: 48px;
}

.login-title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: var(--text-color);
  margin-bottom: 0.4rem;
}

.login-subtitle {
  font-size: 0.88rem;
  color: var(--text-color-secondary);
  line-height: 1.4;
}

.cert-pills {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.cert-pill {
  padding: 0.25rem 0.65rem;
  background: var(--surface-section);
  border: 1px solid var(--surface-border);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-color-secondary);
  letter-spacing: 0.5px;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--surface-section);
  border: 1px solid var(--surface-border);
  border-radius: 14px;
  padding: 1rem 1.2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
  color: var(--text-color);
}

.text-green { color: #34a853; }
.text-blue { color: #1a73e8; }
.text-purple { color: #8e24aa; }

.login-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.auth-error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  background: rgba(234, 67, 53, 0.1);
  border: 1px solid rgba(234, 67, 53, 0.3);
  border-radius: 10px;
  color: #c5221f;
  font-size: 0.82rem;
  width: 100%;
}

.google-btn-wrapper {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.google-btn-container {
  min-height: 44px;
  display: flex;
  justify-content: center;
}

.google-btn-placeholder {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: var(--text-color-secondary);
  padding: 0.75rem;
}

.btn-google-fallback {
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.2rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.btn-google-fallback:hover {
  background: var(--bg-subtle);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0.8rem 0;
  width: 100%;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 0.8rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dev-login-section {
  width: 100%;
}

.btn-dev-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--surface-section);
  border: 1px dashed var(--surface-border);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-dev-login:hover {
  background: var(--surface-border);
}

.login-footer {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  line-height: 1.5;
}

.fair-use-disclaimer {
  margin-bottom: 0.6rem;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.footer-links a {
  color: #1a73e8;
  text-decoration: underline;
  cursor: pointer;
}
</style>
