/**
 * Google Cloud Professional Cloud Architect (PCA) - Backend Server
 * Optimized for Cloud Run & Firestore Native
 * Database: certificacao (southamerica-east1)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Firestore } = require('@google-cloud/firestore');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || 'certificacao';
const GCP_REGION = process.env.GCP_REGION || 'southamerica-east1';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const authClient = new OAuth2Client(GOOGLE_CLIENT_ID || undefined);

// Behind Cloud Run load balancer / reverse proxy
app.set('trust proxy', 1);

// In-Memory cache for Firestore Quiz Catalog to optimize latency and eliminate Firestore Read quotas
let cachedExamInfo = null;
let cachedExamInfoTime = 0;
const cachedQuizzes = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

// Helper: load local quiz data fallback safely from JSON (eliminates node:vm execution)
let localQuizDataCache = null;
function getLocalQuizData() {
  if (localQuizDataCache) return localQuizDataCache;
  try {
    const jsonPath = path.join(__dirname, 'data', 'quiz_data.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      localQuizDataCache = JSON.parse(content);
    }
  } catch (err) {
    console.warn('[Local Fallback] Error reading data/quiz_data.json:', err.message);
  }
  return localQuizDataCache;
}

// Initialize Firestore Native client
let firestore = null;
let firestoreConnected = false;

try {
  const firestoreConfig = {
    databaseId: FIRESTORE_DATABASE_ID
  };
  if (PROJECT_ID) {
    firestoreConfig.projectId = PROJECT_ID;
  }
  firestore = new Firestore(firestoreConfig);
  console.log(`[Firestore] Client initialized for database: "${FIRESTORE_DATABASE_ID}"`);
} catch (error) {
  console.warn(`[Firestore] Warning initializing client: ${error.message}`);
}

// Security & Performance Middlewares
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

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : null;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem bloqueada pela política de CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Rate Limiters to prevent DoS and Firestore quota exhaustion
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // max 300 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições da sua rede. Tente novamente mais tarde.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // max 30 tentativas por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Limite de tentativas de autenticação atingido. Aguarde 15 minutos.' }
});

const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 60, // max 60 operações de gravação
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas gravações enviadas. Aguarde alguns instantes.' }
});

// Apply rate limits
app.use('/api/', apiLimiter);
app.use('/api/auth/verify', authLimiter);
app.use('/api/progress', writeLimiter);
app.use('/api/results', writeLimiter);

// Helper: Verify Google ID Token
async function verifyGoogleToken(idToken) {
  const ticket = await authClient.verifyIdToken({
    idToken: idToken,
    audience: GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
}

// Authentication Middleware: Enforces valid Google Account for protected routes
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_REQUIRED',
      message: 'Autenticação com o Google obrigatória para acessar o simulador.'
    });
  }

  const token = authHeader.substring(7);

  // Dev / Local fallback token: ONLY permitted in non-production environments
  if (token.startsWith('dev_token_')) {
    if (IS_PRODUCTION) {
      console.warn('[Security Warning] Tentativa de uso de dev_token rejeitada em produção!');
      return res.status(401).json({
        success: false,
        code: 'DEV_AUTH_FORBIDDEN',
        message: 'Tokens de desenvolvimento não são aceitos em ambiente de produção.'
      });
    }

    try {
      const payloadRaw = Buffer.from(token.replace('dev_token_', ''), 'base64').toString('utf8');
      req.user = JSON.parse(payloadRaw);
      return next();
    } catch (e) {
      console.warn('[Auth Middleware] Dev token inválido:', e.message);
    }
  }

  try {
    const payload = await verifyGoogleToken(token);
    req.user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture || null
    };
    next();
  } catch (err) {
    console.warn('[Auth Middleware] Token inválido ou expirado:', err.message);
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Sessão do Google inválida ou expirada. Faça login novamente.'
    });
  }
}

// Health Check for Cloud Run probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Status & Firestore Connectivity Check
app.get('/api/status', async (req, res) => {
  let isFirestoreActive = false;
  let firestoreError = null;

  if (firestore) {
    try {
      // Test read query with short timeout to check connectivity
      await firestore.collection('simulados_progresso').limit(1).get();
      isFirestoreActive = true;
      firestoreConnected = true;
    } catch (err) {
      firestoreError = err.message;
      firestoreConnected = false;
    }
  }

  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    firestore: {
      active: isFirestoreActive,
      databaseId: FIRESTORE_DATABASE_ID,
      region: GCP_REGION,
      error: firestoreError ? (firestoreError.includes('Could not load the default credentials') ? 'Credentials not configured (Local Fallback)' : firestoreError) : null
    }
  });
});

// GET /api/auth/config - Provide Google Client ID to frontend
app.get('/api/auth/config', (req, res) => {
  res.json({ clientId: GOOGLE_CLIENT_ID });
});

// POST /api/auth/dev-login - Acesso de contingência/desenvolvimento local (bloqueado em produção)
app.post('/api/auth/dev-login', async (req, res) => {
  if (IS_PRODUCTION) {
    return res.status(403).json({
      success: false,
      code: 'DEV_LOGIN_DISABLED',
      message: 'O endpoint de dev-login está permanentemente desativado em produção.'
    });
  }

  const devUser = {
    userId: 'dev_local_user',
    email: 'developer@local.dev',
    name: 'Dev Local',
    picture: null,
    lastLoginAt: new Date().toISOString()
  };

  const devToken = 'dev_token_' + Buffer.from(JSON.stringify(devUser)).toString('base64');

  if (firestore) {
    try {
      await firestore.collection('usuarios').doc(devUser.userId).set({
        ...devUser,
        updatedAt: Firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (dbErr) {
      console.warn('[Firestore] Aviso dev-login:', dbErr.message);
    }
  }

  res.json({ success: true, token: devToken, user: devUser });
});

// POST /api/auth/verify - Validate token and register/update user in Firestore
app.post('/api/auth/verify', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token de autenticação não fornecido.' });
  }

  // Dev Token Bypass: strictly disabled in production
  if (token.startsWith('dev_token_')) {
    if (IS_PRODUCTION) {
      return res.status(401).json({
        success: false,
        code: 'DEV_AUTH_FORBIDDEN',
        message: 'Tokens de desenvolvimento não são aceitos em ambiente de produção.'
      });
    }

    try {
      const payloadRaw = Buffer.from(token.replace('dev_token_', ''), 'base64').toString('utf8');
      const devPayload = JSON.parse(payloadRaw);
      return res.json({ success: true, user: devPayload });
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Dev token inválido.' });
    }
  }

  try {
    const payload = await verifyGoogleToken(token);
    const userData = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture || null,
      lastLoginAt: new Date().toISOString()
    };

    if (firestore) {
      try {
        await firestore.collection('usuarios').doc(payload.sub).set({
          ...userData,
          updatedAt: Firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('[Firestore] Aviso ao registrar usuário em "usuarios":', dbErr.message);
      }
    }

    res.json({ success: true, user: userData });
  } catch (err) {
    console.warn('[API /api/auth/verify] Token Google inválido:', err.message);
    res.status(401).json({ success: false, message: 'Token de autenticação inválido ou expirado.' });
  }
});

// Helper: Authorize cache bypass (disables unauthenticated force-refresh in production)
function canBypassCache(req) {
  if (!IS_PRODUCTION) return req.query.refresh === 'true';
  const adminSecret = process.env.ADMIN_REFRESH_SECRET;
  return Boolean(adminSecret && req.headers['x-admin-refresh-key'] === adminSecret && req.query.refresh === 'true');
}

// GET /api/quizzes - List quiz catalog summary & exam sections from Firestore (Protected)
app.get('/api/quizzes', requireAuth, async (req, res) => {
  const forceRefresh = canBypassCache(req);
  const now = Date.now();

  // Return from in-memory cache if fresh
  if (!forceRefresh && cachedExamInfo && (now - cachedExamInfoTime < CACHE_TTL_MS)) {
    return res.json({ success: true, source: 'firestore-cache', ...cachedExamInfo });
  }

  if (firestore) {
    try {
      const docRef = firestore.collection('config_exame').doc('pca_info');
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        cachedExamInfo = {
          examTitle: data.examTitle,
          version: data.version || '1.0',
          totalQuizzes: data.totalQuizzes || 7,
          totalQuestions: data.totalQuestions || 420,
          sections: data.sections || {},
          quizzes: data.quizzesSummary || []
        };
        cachedExamInfoTime = now;
        return res.json({ success: true, source: 'firestore', ...cachedExamInfo });
      }
    } catch (err) {
      console.warn('[API /api/quizzes GET] Firestore error, trying fallback:', err.message);
    }
  }

  // Graceful fallback to local data if Firestore is offline
  const local = getLocalQuizData();
  if (local) {
    const quizzesSummary = local.quizzes.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      questionCount: q.questionCount || 60,
      sourceFile: q.sourceFile || '',
      sectionDistribution: q.sectionDistribution || {}
    }));
    return res.json({
      success: true,
      source: 'local-fallback',
      examTitle: local.examTitle,
      version: local.version,
      totalQuizzes: local.totalQuizzes,
      totalQuestions: local.totalQuestions,
      sections: local.sections,
      quizzes: quizzesSummary
    });
  }

  res.status(503).json({ success: false, message: 'Dados de simulados indisponíveis.' });
});

// GET /api/quizzes/:quizId - Fetch full quiz with questions from Firestore (Protected)
app.get('/api/quizzes/:quizId', requireAuth, async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  if (isNaN(quizId) || quizId < 1 || quizId > 50) {
    return res.status(400).json({ success: false, message: 'Invalid quizId' });
  }

  const forceRefresh = canBypassCache(req);
  const cached = cachedQuizzes.get(quizId);
  const now = Date.now();

  // Return from in-memory cache if fresh
  if (!forceRefresh && cached && (now - cached.time < CACHE_TTL_MS)) {
    return res.json({ success: true, source: 'firestore-cache', quiz: cached.data });
  }

  if (firestore) {
    try {
      const docRef = firestore.collection('simulados_catalogo').doc(`quiz_${quizId}`);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        cachedQuizzes.set(quizId, { data, time: now });
        return res.json({ success: true, source: 'firestore', quiz: data });
      }
    } catch (err) {
      console.warn(`[API /api/quizzes/${quizId} GET] Firestore error, trying fallback:`, err.message);
    }
  }

  // Graceful fallback to local data
  const local = getLocalQuizData();
  if (local && local.quizzes) {
    const localQuiz = local.quizzes.find(q => q.id === quizId);
    if (localQuiz) {
      return res.json({ success: true, source: 'local-fallback', quiz: localQuiz });
    }
  }

  res.status(404).json({ success: false, message: `Simulado ${quizId} não encontrado.` });
});

// GET /api/progress - List all saved simulation progress for current user
app.get('/api/progress', requireAuth, async (req, res) => {
  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore client not initialized' });
  }

  try {
    const snapshot = await firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('simulados_progresso')
      .get();

    const progressMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data && data.quizId) {
        progressMap[data.quizId] = {
          quizId: data.quizId,
          quizTitle: data.quizTitle || `Simulado ${data.quizId}`,
          currentQuestionIndex: data.currentQuestionIndex || 0,
          answeredCount: Object.keys(data.userAnswers || {}).length,
          savedAt: data.savedAt || null
        };
      }
    });

    res.json({ success: true, progress: progressMap });
  } catch (error) {
    console.error(`[API /api/progress GET - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao carregar progresso.' : error.message
    });
  }
});

// GET /api/progress/:quizId - Get single quiz progress for current user
app.get('/api/progress/:quizId', requireAuth, async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  if (isNaN(quizId) || quizId < 1 || quizId > 50) {
    return res.status(400).json({ success: false, message: 'Invalid quizId' });
  }

  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  }

  try {
    const docRef = firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('simulados_progresso')
      .doc(`quiz_${quizId}`);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.json({ success: true, exists: false });
    }

    res.json({ success: true, exists: true, data: docSnap.data() });
  } catch (error) {
    console.error(`[API /api/progress/${quizId} GET - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao consultar progresso do simulado.' : error.message
    });
  }
});

// POST /api/progress/:quizId - Save simulation progress for current user
app.post('/api/progress/:quizId', requireAuth, async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  if (isNaN(quizId) || quizId < 1 || quizId > 50) {
    return res.status(400).json({ success: false, message: 'Invalid quizId' });
  }

  const { quizTitle, userAnswers, flaggedQuestions, revealedExplanations, currentQuestionIndex, timeElapsed, filteredWrongOnly } = req.body;

  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  }

  try {
    const docRef = firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('simulados_progresso')
      .doc(`quiz_${quizId}`);

    const payload = {
      userId: req.user.userId,
      userEmail: req.user.email,
      quizId,
      quizTitle: quizTitle || `Simulado ${quizId}`,
      mode: 'simulado',
      userAnswers: userAnswers || {},
      flaggedQuestions: flaggedQuestions || {},
      revealedExplanations: revealedExplanations || {},
      currentQuestionIndex: Number(currentQuestionIndex) || 0,
      timeElapsed: Number(timeElapsed) || 0,
      filteredWrongOnly: Boolean(filteredWrongOnly),
      savedAt: new Date().toISOString(),
      updatedAt: Firestore.FieldValue.serverTimestamp()
    };

    await docRef.set(payload, { merge: true });
    res.json({ success: true, message: 'Progresso salvo com sucesso no Firestore', savedAt: payload.savedAt });
  } catch (error) {
    console.error(`[API /api/progress/${quizId} POST - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao salvar progresso do simulado.' : error.message
    });
  }
});

// DELETE /api/progress/:quizId - Discard simulation progress for current user
app.delete('/api/progress/:quizId', requireAuth, async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  if (isNaN(quizId) || quizId < 1 || quizId > 50) {
    return res.status(400).json({ success: false, message: 'Invalid quizId' });
  }

  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  }

  try {
    const docRef = firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('simulados_progresso')
      .doc(`quiz_${quizId}`);

    await docRef.delete();
    res.json({ success: true, message: `Progresso do simulado ${quizId} removido do Firestore` });
  } catch (error) {
    console.error(`[API /api/progress/${quizId} DELETE - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao remover progresso do simulado.' : error.message
    });
  }
});

// POST /api/results - Store completed exam / simulado results for current user
app.post('/api/results', requireAuth, async (req, res) => {
  const {
    quizId,
    quizTitle,
    mode,
    scorePercentage,
    correctCount,
    wrongCount,
    unansweredCount,
    totalQuestions,
    timeElapsed,
    timeSpentFormatted,
    breakdown
  } = req.body;

  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  }

  try {
    const docRef = firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('exames_resultados')
      .doc();

    const payload = {
      userId: req.user.userId,
      userEmail: req.user.email,
      userName: req.user.name,
      quizId: Number(quizId),
      quizTitle: String(quizTitle || `Simulado ${quizId}`),
      mode: mode === 'exame' ? 'exame' : 'simulado',
      scorePercentage: Number(scorePercentage) || 0,
      passed: Number(scorePercentage) >= 70,
      correctCount: Number(correctCount) || 0,
      wrongCount: Number(wrongCount) || 0,
      unansweredCount: Number(unansweredCount) || 0,
      totalQuestions: Number(totalQuestions) || 60,
      timeElapsed: Number(timeElapsed) || 0,
      timeSpentFormatted: String(timeSpentFormatted || '00:00:00'),
      breakdown: breakdown || {},
      completedAt: new Date().toISOString(),
      createdAt: Firestore.FieldValue.serverTimestamp()
    };

    await docRef.set(payload);
    res.json({ success: true, id: docRef.id, message: 'Resultado gravado com sucesso no Firestore' });
  } catch (error) {
    console.error(`[API /api/results POST - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao gravar resultado do exame.' : error.message
    });
  }
});

// GET /api/results - List recent exam results for current user
app.get('/api/results', requireAuth, async (req, res) => {
  if (!firestore) {
    return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  }

  try {
    const snapshot = await firestore
      .collection('usuarios')
      .doc(req.user.userId)
      .collection('exames_resultados')
      .orderBy('completedAt', 'desc')
      .limit(20)
      .get();

    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error(`[API /api/results GET - User: ${req.user.userId}]`, error.message);
    res.status(500).json({
      success: false,
      fallback: true,
      error: IS_PRODUCTION ? 'Erro ao carregar histórico de exames.' : error.message
    });
  }
});

// Serve Static Frontend Assets from 'public/'
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 GCP PCA Quiz Platform running on port ${PORT}`);
  console.log(`☁️  Target Firestore Database: "${FIRESTORE_DATABASE_ID}"`);
  console.log(`📍 Region: ${GCP_REGION}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

// Graceful Shutdown for Cloud Run
const handleShutdown = (signal) => {
  console.log(`[Cloud Run] ${signal} received. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log('[Cloud Run] HTTP server terminated safely.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
