# Multi-stage / lightweight production container for Google Cloud Run
FROM node:20-alpine AS runner

# Install dumb-init or rely on Node 20 signal handling
WORKDIR /usr/src/app

# Security: Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV FIRESTORE_DATABASE_ID=certificacao
ENV GCP_REGION=southamerica-east1

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application source code, internal data and frontend public folder
COPY server.js ./
COPY data/ ./data/
COPY public/ ./public/

# Security: Run as non-root unprivileged user
USER node

# Expose standard Cloud Run port
# Security & Liveness: Container health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start server
CMD ["node", "server.js"]
