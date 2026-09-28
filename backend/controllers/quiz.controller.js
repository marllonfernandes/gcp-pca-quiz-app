const { firestore } = require('../config/firestore');
const { EXAMS_CATALOG } = require('../config/exams');
const { LRUCache } = require('lru-cache');
const path = require('path');
const fs = require('fs');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const CACHE_TTL_MS = 15 * 60 * 1000;

let cachedExamInfo = null;
let cachedExamInfoTime = 0;
const cachedQuizzes = new LRUCache({ max: 100, ttl: CACHE_TTL_MS });

let localQuizDataCache = null;
function getLocalQuizData() {
  if (localQuizDataCache) return localQuizDataCache;
  try {
    const jsonPath = path.join(__dirname, '..', 'data', 'quiz_data.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      localQuizDataCache = JSON.parse(content);
    }
  } catch (err) {
    console.warn('[Local Fallback] Error reading data/quiz_data.json:', err.message);
  }
  return localQuizDataCache;
}

function canBypassCache(req) {
  if (!IS_PRODUCTION) return req.query.refresh === 'true';
  const adminSecret = process.env.ADMIN_REFRESH_SECRET;
  return Boolean(adminSecret && req.headers['x-admin-refresh-key'] === adminSecret && req.query.refresh === 'true');
}

exports.listExams = (req, res) => {
  res.json({
    success: true,
    total: EXAMS_CATALOG.length,
    activeCount: EXAMS_CATALOG.filter(e => e.status === 'active').length,
    exams: EXAMS_CATALOG
  });
};

exports.getExam = (req, res) => {
  const exam = EXAMS_CATALOG.find(e => e.id === req.params.examId);
  if (!exam) return res.status(404).json({ success: false, message: 'Exame não encontrado.' });
  res.json({ success: true, exam });
};

exports.listQuizzes = async (req, res) => {
  const examId = String(req.query.examId || 'gcp-pca').toLowerCase();
  const forceRefresh = canBypassCache(req);
  const now = Date.now();

  if (examId !== 'gcp-pca') {
    const targetExam = EXAMS_CATALOG.find(e => e.id === examId);
    if (!targetExam) return res.status(404).json({ success: false, message: `Exame não encontrado.` });

    const previewQuizzes = Array.from({ length: targetExam.totalQuizzes }, (_, i) => ({
      id: i + 1, title: `Simulado ${i + 1} (${targetExam.code})`,
      description: `Simulado preparatório`, questionCount: 60,
      comingSoon: targetExam.status === 'coming_soon', sectionDistribution: {}
    }));

    return res.json({
      success: true, source: 'catalog-preview', examId: targetExam.id,
      examTitle: targetExam.name, status: targetExam.status, version: '1.0',
      totalQuizzes: targetExam.totalQuizzes, totalQuestions: targetExam.totalQuestions,
      sections: targetExam.sections, quizzes: previewQuizzes
    });
  }

  if (!forceRefresh && cachedExamInfo && (now - cachedExamInfoTime < CACHE_TTL_MS)) {
    return res.json({ success: true, source: 'firestore-cache', examId: 'gcp-pca', ...cachedExamInfo });
  }

  if (firestore) {
    try {
      const docRef = firestore.collection('config_exame').doc('pca_info');
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        cachedExamInfo = {
          examTitle: data.examTitle, version: data.version || '1.0',
          totalQuizzes: data.totalQuizzes || 7, totalQuestions: data.totalQuestions || 420,
          sections: data.sections || {}, quizzes: data.quizzesSummary || []
        };
        cachedExamInfoTime = now;
        return res.json({ success: true, source: 'firestore', examId: 'gcp-pca', ...cachedExamInfo });
      }
    } catch (err) { }
  }

  const local = getLocalQuizData();
  if (local) {
    return res.json({
      success: true, source: 'local-fallback', examId: 'gcp-pca',
      examTitle: local.examTitle, version: local.version,
      totalQuizzes: local.totalQuizzes, totalQuestions: local.totalQuestions,
      sections: local.sections, quizzes: local.quizzes.map(q => ({ id: q.id, title: q.title, description: q.description, questionCount: q.questionCount || 60, sourceFile: q.sourceFile || '', sectionDistribution: q.sectionDistribution || {} }))
    });
  }
  res.status(503).json({ success: false, message: 'Dados indisponíveis.' });
};

exports.getQuiz = async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  const examId = String(req.query.examId || 'gcp-pca').toLowerCase();

  if (isNaN(quizId) || quizId < 1 || quizId > 50) return res.status(400).json({ success: false, message: 'Invalid quizId' });
  const validExamIds = EXAMS_CATALOG.map(e => e.id);
  if (!validExamIds.includes(examId)) return res.status(400).json({ success: false, message: 'Invalid examId' });

  if (examId !== 'gcp-pca') {
    return res.status(404).json({ success: false, comingSoon: true, message: 'Em breve' });
  }

  const forceRefresh = canBypassCache(req);
  const cacheKey = `${examId}_${quizId}`;
  const cached = cachedQuizzes.get(cacheKey) || cachedQuizzes.get(quizId);

  if (!forceRefresh && cached) {
    return res.json({ success: true, source: 'firestore-cache', examId, quiz: cached.data });
  }

  if (firestore) {
    try {
      const docSnap = await firestore.collection('simulados_catalogo').doc(`quiz_${quizId}`).get();
      if (docSnap.exists) {
        cachedQuizzes.set(cacheKey, { data: docSnap.data(), time: Date.now() });
        return res.json({ success: true, source: 'firestore', examId, quiz: docSnap.data() });
      }
    } catch (err) {}
  }

  const local = getLocalQuizData();
  if (local && local.quizzes) {
    const localQuiz = local.quizzes.find(q => q.id === quizId);
    if (localQuiz) return res.json({ success: true, source: 'local-fallback', examId, quiz: localQuiz });
  }
  res.status(404).json({ success: false, message: `Simulado não encontrado.` });
};
