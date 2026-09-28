const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../middlewares/auth');

const authController = require('../controllers/auth.controller');
const quizController = require('../controllers/quiz.controller');
const progressController = require('../controllers/progress.controller');
const resultsController = require('../controllers/results.controller');
const { firestore, firestoreConnected, FIRESTORE_DATABASE_ID, GCP_REGION } = require('../config/firestore');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições da sua rede. Tente novamente mais tarde.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Limite de tentativas de autenticação atingido. Aguarde 15 minutos.' }
});

const writeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas gravações enviadas. Aguarde alguns instantes.' }
});

router.use('/', apiLimiter);
router.use('/auth/verify', authLimiter);
router.use('/progress', writeLimiter);
router.use('/results', writeLimiter);

// Auth
router.get('/auth/config', authController.getConfig);
router.post('/auth/dev-login', authController.devLogin);
router.post('/auth/verify', authController.verify);

// Quizzes
router.get('/exams', quizController.listExams);
router.get('/exams/:examId', quizController.getExam);
router.get('/quizzes', requireAuth, quizController.listQuizzes);
router.get('/quizzes/:quizId', requireAuth, quizController.getQuiz);

// Progress
router.get('/progress', requireAuth, progressController.listProgress);
router.get('/progress/:quizId', requireAuth, progressController.getProgress);
router.post('/progress/:quizId', requireAuth, progressController.saveProgress);
router.delete('/progress/:quizId', requireAuth, progressController.deleteProgress);

// Results
router.get('/results', requireAuth, resultsController.listResults);
router.post('/results', requireAuth, resultsController.saveResult);

// Status
router.get('/status', async (req, res) => {
  let isFirestoreActive = false;
  let firestoreError = null;

  if (firestore) {
    try {
      await firestore.collection('simulados_progresso').limit(1).get();
      isFirestoreActive = true;
    } catch (err) {
      firestoreError = err.message;
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

module.exports = router;
