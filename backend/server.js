/**
 * Google Cloud Professional Cloud Architect (PCA) - Backend Server
 * Optimized for Cloud Run & Firestore Native
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');
const { FIRESTORE_DATABASE_ID, GCP_REGION } = require('./config/firestore');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com/gsi/client"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com/gsi/style"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://accounts.google.com/gsi/", "https://translate.googleapis.com"],
      frameSrc: ["'self'", "https://accounts.google.com/gsi/"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : null;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem bloqueada pela política de CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 GCP PCA Quiz Platform running on port ${PORT}`);
  console.log(`☁️  Target Firestore Database: "${FIRESTORE_DATABASE_ID}"`);
  console.log(`📍 Region: ${GCP_REGION}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

const handleShutdown = (signal) => {
  console.log(`[Cloud Run] ${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[Cloud Run] HTTP server terminated safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
module.exports = { app, server };
