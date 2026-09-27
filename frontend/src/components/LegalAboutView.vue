<template>
  <div class="legal-about-view">
    <div class="view-header">
      <button class="btn-back" @click="goBack">
        <i class="pi pi-arrow-left"></i>
        <span>{{ isPt ? 'Voltar' : 'Back' }}</span>
      </button>
      <h3>{{ isPt ? 'Aviso Legal & Conformidade' : 'Legal Notice & Compliance' }}</h3>
      
      <div class="legal-tabs-bar">
        <button 
          class="tab-btn" 
          :class="{ active: store.activeLegalTab === 'disclaimer' }"
          @click="store.activeLegalTab = 'disclaimer'"
        >
          {{ isPt ? 'Aviso de Marcas' : 'Trademarks' }}
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: store.activeLegalTab === 'terms' }"
          @click="store.activeLegalTab = 'terms'"
        >
          {{ isPt ? 'Termos de Uso' : 'Terms' }}
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: store.activeLegalTab === 'privacy' }"
          @click="store.activeLegalTab = 'privacy'"
        >
          {{ isPt ? 'Privacidade & LGPD' : 'Privacy' }}
        </button>
      </div>
    </div>

    <div class="legal-content">
      <!-- Disclaimer Tab -->
      <div v-if="store.activeLegalTab === 'disclaimer'" class="tab-body">
        <h4>1. {{ isPt ? 'Isenção de Afiliação e Parceria' : 'Non-Affiliation Disclaimer' }}</h4>
        <p>
          {{ isPt 
            ? 'Este aplicativo é uma plataforma independente de treinamento desenvolvida para a capacitação de profissionais que se preparam para os exames de certificação Google Cloud.'
            : 'This application is an independent practice exam platform built to help professionals prepare for official Google Cloud examinations.' 
          }}
        </p>
        <p><strong>{{ isPt ? 'NÃO possuímos qualquer vínculo institucional, patrocínio ou endosso por parte da Google LLC.' : 'We have NO institutional partnership, sponsorship, or endorsement by Google LLC.' }}</strong></p>
        
        <h4>2. {{ isPt ? 'Marcas Registradas & Uso Nominativo' : 'Trademarks & Fair Use' }}</h4>
        <p>
          {{ isPt 
            ? '"Google", "Google Cloud", "GCP", "Professional Cloud Architect" e logotipos associados são marcas registradas e propriedades exclusivas da Google LLC.'
            : '"Google", "Google Cloud", "GCP", "Professional Cloud Architect", and associated logos are registered trademarks of Google LLC.' 
          }}
        </p>
        <p>
          {{ isPt 
            ? 'O uso destas nomenclaturas neste site é estritamente nominativo, para o propósito singular de referenciar o escopo de estudos e identificar publicamente o exame em questão (Fair Use).'
            : 'The use of these names on this platform is strictly nominative, for the sole purpose of referencing the study scope and identifying the exam in question (Fair Use).' 
          }}
        </p>
      </div>

      <!-- Terms Tab -->
      <div v-else-if="store.activeLegalTab === 'terms'" class="tab-body">
        <h4>1. {{ isPt ? 'Natureza do Conteúdo' : 'Nature of Content' }}</h4>
        <p>
          {{ isPt 
            ? 'As questões aqui apresentadas não são cópias ("dumps") dos exames reais. São cenários técnicos originais, elaborados independentemente para refletir o nível de dificuldade, os domínios de conhecimento (Blueprint) e o estilo de formulação da certificação oficial.'
            : 'The questions presented here are not copies ("dumps") of real exams. They are original technical scenarios, developed independently to reflect the difficulty level, the blueprint domains, and the formulation style of the official certification.' 
          }}
        </p>
        
        <h4>2. {{ isPt ? 'Ausência de Garantia de Aprovação' : 'No Guarantee of Passing' }}</h4>
        <p>
          {{ isPt 
            ? 'O alto desempenho neste simulador não garante, sob qualquer hipótese, a aprovação no exame oficial. O exame real pode abordar conceitos atualizados recentemente e testar a capacidade analítica sob pressão de tempo.'
            : 'High performance on this simulator does not guarantee passing the official exam. The real exam may cover recently updated concepts and test analytical ability under time pressure.' 
          }}
        </p>
        
        <h4>3. {{ isPt ? 'Licença MIT & Código Aberto' : 'MIT License & Open Source' }}</h4>
        <p>
          {{ isPt 
            ? 'A arquitetura em nuvem (Cloud Run, Firestore) e o código-fonte deste simulador são mantidos de forma aberta e transparente. O código sob a licença MIT permite o uso e estudo acadêmico de como o aplicativo foi construído.'
            : 'The cloud architecture (Cloud Run, Firestore) and the source code of this simulator are maintained openly. The MIT licensed code allows use and academic study of how the application was built.' 
          }}
        </p>
      </div>

      <!-- Privacy Tab -->
      <div v-else-if="store.activeLegalTab === 'privacy'" class="tab-body">
        <h4>1. {{ isPt ? 'Identidade Google (Google Sign-In)' : 'Google Identity (Sign-In)' }}</h4>
        <p>
          {{ isPt 
            ? 'Utilizamos a federação de identidade do Google Workspace estritamente para autenticar seu acesso de forma segura e não gerenciar senhas. Coletamos apenas seu Nome, E-mail e Foto de Perfil fornecidos explicitamente pela API.'
            : 'We use Google Identity Services strictly to authenticate your access securely without managing passwords. We only collect your Name, Email, and Profile Picture explicitly provided by the API.' 
          }}
        </p>
        
        <h4>2. {{ isPt ? 'Armazenamento de Dados (Firestore)' : 'Data Storage (Firestore)' }}</h4>
        <p>
          {{ isPt 
            ? 'Os dados relativos às suas tentativas de simulado (respostas, tempo gasto e pontuação) são armazenados no banco de dados Cloud Firestore hospedado na região sul-americana (southamerica-east1) para fornecer seu histórico de resultados.'
            : 'Data regarding your quiz attempts (answers, time spent, and score) are stored in a Cloud Firestore database to provide your results history.' 
          }}
        </p>
        
        <h4>3. {{ isPt ? 'Solicitação de Deleção de Dados (LGPD/GDPR)' : 'Data Deletion Requests (LGPD/GDPR)' }}</h4>
        <p>
          {{ isPt 
            ? 'Em conformidade com a LGPD, você possui o direito de solicitar a exclusão de todos os seus rastros armazenados nesta plataforma. Para solicitar a exclusão, abra uma issue no repositório do projeto no GitHub informando seu e-mail de acesso.'
            : 'In compliance with privacy laws, you have the right to request deletion of all your stored data. To request deletion, open an issue in the project GitHub repository with your email.' 
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quizStore';

const store = useQuizStore();
const isPt = computed(() => store.uiLanguage === 'pt');

function goBack() {
  store.currentView = 'dashboard';
}
</script>

<style scoped>
.legal-about-view {
  padding: 1.5rem;
  max-width: 800px;
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

h3 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.legal-tabs-bar {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.legal-tabs-bar::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.legal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.tab-body {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.tab-body h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.tab-body h4:first-child {
  margin-top: 0;
}

.tab-body p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tab-body strong {
  color: var(--text-primary);
  font-weight: 600;
}

@media (max-width: 640px) {
  .legal-about-view {
    padding: 1rem;
  }
  .legal-content {
    padding: 1.25rem;
  }
}
</style>
