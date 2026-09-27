# Multi-stage lightweight production container for Google Cloud Run
# Stage 1: Build the Vue 3 + PrimeVue frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production runtime for Express server
FROM node:20-alpine AS runner
WORKDIR /usr/src/app/backend

# Security: Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV FIRESTORE_DATABASE_ID=certificacao
ENV GCP_REGION=southamerica-east1

# Copy backend package descriptors
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy server code and data
COPY backend/server.js ./
COPY backend/data/ ./data/

# Copy compiled frontend from Stage 1 into public/
COPY --from=frontend-builder /app/backend/public ./public/

# Security: Run as non-root unprivileged user
USER node

# Security & Liveness: Container health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start server
CMD ["node", "server.js"]
