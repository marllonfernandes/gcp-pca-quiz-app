# GCP Professional Cloud Architect — App & Cloud Run Service

Aplicação completa de simulados e exames para certificação **Google Cloud Professional Cloud Architect (PCA)**, preparada para deploy no **Google Cloud Run** com persistência nativa no **Google Cloud Firestore** e **Autenticação Obrigatória com Conta Google (Google Identity Services)**.

---

## 🏛️ Arquitetura da Solução

```
[ Usuário / Navegador Mobile ou Desktop ]
               │
               ▼ Google Identity Services (OAuth 2.0 / GIS)
        [ Login Obrigatório ]
               │
               ▼ HTTPS (Bearer ID Token JWT)
      [ Google Cloud Run ] (Port 8080, Node 20 LTS, Non-root)
       ├── Express Web Server (Helmet CSP, Gzip/Brotli, Graceful Shutdown)
       ├── Static File Serving (/public: index.html, styles.css, app.js)
       ├── Auth Layer (google-auth-library: /api/auth/verify, /api/auth/config)
       └── REST API (/api/quizzes, /api/progress, /api/results, /api/status, /health)
               │
               ▼ ADC (Application Default Credentials - Cloud Run Service Account)
   [ Google Cloud Firestore (Modo Nativo) ]
       ├── Database: "certificacao"
       ├── Região: southamerica-east1 (São Paulo)
       ├── Coleção: config_exame (pca_info: pesos das seções e catálogo)
       ├── Coleção: simulados_catalogo (quiz_1 ... quiz_7 com 420 questões)
       └── Coleção: usuarios/{userId}/
              ├── Perfil: nome, email, foto, lastLoginAt
              ├── Subcoleção: simulados_progresso/ (quiz_1 ... quiz_7 isolados)
              └── Subcoleção: exames_resultados/ (histórico e breakdown por usuário)
```

---

## 🛡️ Segurança & Confiabilidade (Security & Architecture Patterns)

1. **Autenticação Obrigatória & Isolamento Total por Usuário (Multi-Tenancy)**:
   - Login obrigatório via **Google Identity Services (GIS)** utilizando o Client ID oficial.
   - Cada requisição protegida envia o token JWT via header `Authorization: Bearer <token>`.
   - O backend valida a assinatura do token diretamente com a biblioteca oficial `google-auth-library`.
   - Todo o progresso e histórico de simulados são armazenados na subcoleção isolada `usuarios/{userId}/`, eliminando completamente o risco de sobreposição de dados entre usuários diferentes.

2. **Autenticação sem Segredos Hardcoded (Zero Secrets)**:
   - O Cloud Run conecta-se ao Firestore usando **Application Default Credentials (ADC)** herdadas da conta de serviço vinculada.
   - Nenhuma chave JSON privada é armazenada no código ou na imagem Docker.

3. **Princípio do Menor Privilégio (Least Privilege)**:
   - A conta de serviço do Cloud Run requer apenas a role:
     `roles/datastore.user` (Cloud Datastore User).

4. **Defesa em Profundidade no Container (Container Hardening)**:
   - Execução como usuário sem privilégios (`USER node`, UID 1000).
   - Multi-stage build / `node:20-alpine` de baixo peso e superfície de ataque mínima.
   - Tratamento de sinais `SIGTERM` e `SIGINT` para drenagem de conexões durante escala para zero no Cloud Run.

5. **Headers HTTP Seguros (OWASP Compliance)**:
   - Middleware `helmet` com Content Security Policy (CSP) customizado para Google Identity Services (`https://accounts.google.com/gsi/*`), proteção anti-clickjacking (`X-Frame-Options: SAMEORIGIN`) e `X-Content-Type-Options: nosniff`.

6. **Cache em Memória & Alta Performance**:
   - Cache em memória no backend (TTL de 15 min) para o catálogo de simulados, reduzindo leituras e custos no Firestore.

---

## 📁 Estrutura de Diretórios

```
app/
├── Makefile                # Automação de deploy, IAM e monitoramento
├── Dockerfile              # Imagem de produção para Cloud Run
├── .dockerignore           # Exclusão de arquivos desnecessários na build
├── .env.example            # Variáveis de ambiente de exemplo
├── package.json            # Dependências do backend Node.js
├── server.js               # Servidor Express & API REST Firestore
├── README.md               # Esta documentação
├── data/                   # Dados internos e backup/seed
│   └── quiz_data.json      # Catálogo mestre de 420 questões (seed & fallback)
├── scripts/                # Scripts de infraestrutura e migração
│   └── seed-firestore.js   # Script de carga inicial para o Cloud Firestore
└── public/                 # Frontend Web estático
    ├── index.html          # Interface responsiva bilíngue com logo oficial GCP
    ├── styles.css          # Estilos CSS com tema claro/escuro e mobile-first
    └── app.js              # Controlador SPA com suporte a Firestore API
```

---

## 🚀 Como Rodar Localmente

### 1. Instalar dependências
```bash
cd app
npm install
```

### 2. Iniciar servidor
```bash
npm start
# ou com recarga automática durante desenvolvimento:
npm run dev
```

Acesse no navegador: `http://localhost:8080`

> **Nota:** Para testar a conexão real com o Firestore localmente, certifique-se de estar autenticado com:
> `gcloud auth application-default login`

---

## 🚢 Como Fazer Deploy no Google Cloud Run

### Pré-requisitos:
- Google Cloud SDK (`gcloud`) instalado e autenticado.
- Projeto GCP configurado (`gcloud config set project SEU_PROJETO_ID`).
- Banco Firestore `certificacao` criado no modo nativo na região `southamerica-east1`.

### Opção 1: Usando o Makefile (Recomendado)
```bash
# 1. Habilitar as APIs necessárias (Cloud Run, Firestore, Artifact Registry, Cloud Build)
make enable-apis

# 2. Configurar permissões na Service Account (ex: SEU_PROJECT_NUMBER-compute@developer.gserviceaccount.com)
make setup-iam

# 3. Popular as 420 questões e catálogo no Firestore
make seed-firestore

# (Ou execute setup completo: make setup)

# 4. Fazer o deploy no Cloud Run
make deploy

# 5. Ver status, logs ou abrir o app
make status
make logs
make open
```

### Opção 2: Comando Direto `gcloud`
```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud run deploy gcp-pca-quiz-app \
  --source . \
  --region southamerica-east1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --set-env-vars="FIRESTORE_DATABASE_ID=certificacao,GCP_REGION=southamerica-east1,NODE_ENV=production" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5
```

---

## 🔑 Permissão de Acesso ao Firestore (IAM)

Por padrão, o Cloud Run utiliza a conta de serviço padrão do projeto (`PROJECT_NUMBER-compute@developer.gserviceaccount.com`).
Gere a permissão para leitura e gravação no Firestore executando:

```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/datastore.user"
```
