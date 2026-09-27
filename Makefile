# ==============================================================================
# Makefile para GCP Professional Cloud Architect (PCA) Quiz App (Diretório app/)
# ==============================================================================

SHELL := /bin/bash

PROJECT_ID          ?= $(shell gcloud config get-value project 2>/dev/null || echo "seu-projeto-id")
SERVICE_NAME        ?= gcp-pca-quiz-app
REGION              ?= southamerica-east1
DATABASE_ID         ?= certificacao
SERVICE_ACCOUNT     ?= sa-pca-quiz@$(PROJECT_ID).iam.gserviceaccount.com
GOOGLE_CLIENT_ID    ?= $(shell grep GOOGLE_CLIENT_ID .env 2>/dev/null | cut -d '=' -f2)
PORT                ?= 8080
MEMORY              ?= 512Mi
CPU                 ?= 1
MIN_INSTANCES       ?= 0
MAX_INSTANCES       ?= 5

.PHONY: help setup enable-apis setup-iam check-iam deploy url status logs open build-docker run-docker install dev start seed-firestore clean

help:
	@echo "=============================================================================="
	@echo "  🛠️  GCP PCA Quiz Platform (app/) — Comandos do Makefile"
	@echo "=============================================================================="
	@echo "  Projeto GCP Atual    : $(PROJECT_ID)"
	@echo "  Serviço Cloud Run    : $(SERVICE_NAME)"
	@echo "  Região GCP           : $(REGION)"
	@echo "  Banco Firestore      : $(DATABASE_ID)"
	@echo "  Conta de Serviço     : $(SERVICE_ACCOUNT)"
	@echo "=============================================================================="
	@echo "  make enable-apis     - Habilita as APIs necessárias no GCP"
	@echo "  make setup-iam       - Vincula papel (roles/datastore.user) à Service Account"
	@echo "  make setup           - Executa enable-apis e setup-iam em sequência"
	@echo "  make check-iam       - Verifica as permissões da conta de serviço"
	@echo "  make seed-firestore  - Popula as 420 questões e exames no Firestore"
	@echo "  make deploy          - Deploy no Cloud Run com a SA configurada"
	@echo "  make url             - Exibe a URL pública do serviço"
	@echo "  make status          - Mostra status do serviço"
	@echo "  make logs            - Logs em tempo real do Cloud Run"
	@echo "  make open            - Abre o serviço no navegador"
	@echo "  make install         - Instala as dependências Node.js"
	@echo "  make dev             - Inicia o servidor local (dev com reload)"
	@echo "  make start           - Inicia o servidor local de produção"
	@echo "=============================================================================="

setup: enable-apis setup-iam

enable-apis:
	@echo "🔧 Habilitando APIs no projeto $(PROJECT_ID)..."
	gcloud services enable \
		run.googleapis.com \
		firestore.googleapis.com \
		artifactregistry.googleapis.com \
		cloudbuild.googleapis.com \
		--project="$(PROJECT_ID)"
	@echo "✅ APIs habilitadas com sucesso!"

setup-iam:
	@echo "👤 Vinculando papel 'roles/datastore.user' a $(SERVICE_ACCOUNT)..."
	gcloud projects add-iam-policy-binding "$(PROJECT_ID)" \
		--member="serviceAccount:$(SERVICE_ACCOUNT)" \
		--role="roles/datastore.user"
	@echo "✅ Permissão concedida a $(SERVICE_ACCOUNT)!"

check-iam:
	gcloud projects get-iam-policy "$(PROJECT_ID)" \
		--flatten="bindings[].members" \
		--format="table(bindings.role)" \
		--filter="bindings.members:$(SERVICE_ACCOUNT)"

deploy:
	@echo "🚀 Iniciando Deploy para Google Cloud Run..."
	gcloud run deploy "$(SERVICE_NAME)" \
		--source . \
		--region "$(REGION)" \
		--platform managed \
		--allow-unauthenticated \
		--service-account "$(SERVICE_ACCOUNT)" \
		--set-env-vars="FIRESTORE_DATABASE_ID=$(DATABASE_ID),GCP_REGION=$(REGION),NODE_ENV=production,GOOGLE_CLIENT_ID=$(GOOGLE_CLIENT_ID)" \
		--memory "$(MEMORY)" \
		--cpu "$(CPU)" \
		--min-instances "$(MIN_INSTANCES)" \
		--max-instances "$(MAX_INSTANCES)" \
		--project="$(PROJECT_ID)"
	@echo "✅ Deploy concluído!"
	@$(MAKE) url

url:
	@echo -n "🌐 URL do Cloud Run: "
	@gcloud run services describe "$(SERVICE_NAME)" \
		--region "$(REGION)" \
		--project="$(PROJECT_ID)" \
		--format='value(status.url)' 2>/dev/null || echo "Serviço ainda não implantado."

status:
	gcloud run services describe "$(SERVICE_NAME)" \
		--region "$(REGION)" \
		--project="$(PROJECT_ID)"

logs:
	gcloud run services logs tail "$(SERVICE_NAME)" \
		--region "$(REGION)" \
		--project="$(PROJECT_ID)"

open:
	@URL=$$(gcloud run services describe "$(SERVICE_NAME)" --region "$(REGION)" --project="$(PROJECT_ID)" --format='value(status.url)' 2>/dev/null); \
	if [ -n "$$URL" ]; then \
		echo "🚀 Abrindo $$URL ..."; \
		open "$$URL" || xdg-open "$$URL"; \
	else \
		echo "❌ Serviço não encontrado. Execute 'make deploy' primeiro."; \
	fi

install:
	npm run install:all

dev:
	npm run dev

start:
	npm start

seed-firestore:
	@echo "🌱 Populando Firestore (Database: $(DATABASE_ID)) com 420 questões..."
	npm run seed

build-docker:
	docker build -t $(SERVICE_NAME):latest .

run-docker:
	docker run --rm -p $(PORT):8080 \
		-e FIRESTORE_DATABASE_ID="$(DATABASE_ID)" \
		-e GCP_REGION="$(REGION)" \
		-e GOOGLE_CLIENT_ID="$(GOOGLE_CLIENT_ID)" \
		$(SERVICE_NAME):latest

clean:
	rm -rf node_modules npm-debug.log
