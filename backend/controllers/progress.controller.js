const { firestore } = require('../config/firestore');
const { EXAMS_CATALOG } = require('../config/exams');
const { sanitizeObjectKeys } = require('../utils/validator');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

exports.listProgress = async (req, res) => {
  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not initialized' });
  const requestedExamId = req.query.examId ? String(req.query.examId).toLowerCase() : null;

  try {
    const snapshot = await firestore.collection('usuarios').doc(req.user.userId).collection('simulados_progresso').get();
    const progressMap = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data && data.quizId) {
        const itemExamId = data.examId || 'gcp-pca';
        if (requestedExamId && itemExamId !== requestedExamId) return;

        const mapKey = requestedExamId ? data.quizId : `${itemExamId}_${data.quizId}`;
        progressMap[mapKey] = {
          quizId: data.quizId, examId: itemExamId, quizTitle: data.quizTitle || `Simulado ${data.quizId}`,
          currentQuestionIndex: data.currentQuestionIndex || 0, answeredCount: Object.keys(data.userAnswers || {}).length, savedAt: data.savedAt || null
        };
        if (requestedExamId && requestedExamId === itemExamId) progressMap[data.quizId] = progressMap[mapKey];
      }
    });
    res.json({ success: true, examId: requestedExamId || 'all', progress: progressMap });
  } catch (error) {
    res.status(500).json({ success: false, fallback: true, error: IS_PRODUCTION ? 'Erro' : error.message });
  }
};

exports.getProgress = async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  const examId = String(req.query.examId || 'gcp-pca').toLowerCase();

  if (isNaN(quizId) || quizId < 1 || quizId > 50) return res.status(400).json({ success: false, message: 'Invalid quizId' });
  if (!EXAMS_CATALOG.find(e => e.id === examId)) return res.status(400).json({ success: false, message: 'Invalid examId' });

  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });

  try {
    const docId = examId === 'gcp-pca' ? `quiz_${quizId}` : `${examId}_quiz_${quizId}`;
    const docSnap = await firestore.collection('usuarios').doc(req.user.userId).collection('simulados_progresso').doc(docId).get();
    if (!docSnap.exists) return res.json({ success: true, exists: false, examId });
    res.json({ success: true, exists: true, examId, data: docSnap.data() });
  } catch (error) {
    res.status(500).json({ success: false, fallback: true, error: IS_PRODUCTION ? 'Erro' : error.message });
  }
};

exports.saveProgress = async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  const examId = String(req.body.examId || req.query.examId || 'gcp-pca').toLowerCase();

  if (isNaN(quizId) || quizId < 1 || quizId > 50) return res.status(400).json({ success: false, message: 'Invalid quizId' });
  if (!EXAMS_CATALOG.find(e => e.id === examId)) return res.status(400).json({ success: false, message: 'Invalid examId' });
  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });

  let { quizTitle, userAnswers, flaggedQuestions, revealedExplanations, currentQuestionIndex, timeElapsed, filteredWrongOnly } = req.body;
  userAnswers = sanitizeObjectKeys(userAnswers, 420);
  flaggedQuestions = sanitizeObjectKeys(flaggedQuestions, 420);
  revealedExplanations = sanitizeObjectKeys(revealedExplanations, 420);

  try {
    const docId = examId === 'gcp-pca' ? `quiz_${quizId}` : `${examId}_quiz_${quizId}`;
    const payload = {
      userId: req.user.userId, userEmail: req.user.email, examId, quizId,
      quizTitle: quizTitle || `Simulado ${quizId}`, mode: 'simulado',
      userAnswers: userAnswers || {}, flaggedQuestions: flaggedQuestions || {}, revealedExplanations: revealedExplanations || {},
      currentQuestionIndex: Number(currentQuestionIndex) || 0, timeElapsed: Number(timeElapsed) || 0,
      filteredWrongOnly: Boolean(filteredWrongOnly), savedAt: new Date().toISOString(), updatedAt: require('@google-cloud/firestore').FieldValue.serverTimestamp()
    };
    await firestore.collection('usuarios').doc(req.user.userId).collection('simulados_progresso').doc(docId).set(payload, { merge: true });
    res.json({ success: true, message: 'Progresso salvo', examId, savedAt: payload.savedAt });
  } catch (error) {
    res.status(500).json({ success: false, fallback: true, error: IS_PRODUCTION ? 'Erro' : error.message });
  }
};

exports.deleteProgress = async (req, res) => {
  const quizId = parseInt(req.params.quizId, 10);
  const examId = String(req.body.examId || req.query.examId || 'gcp-pca').toLowerCase();

  if (isNaN(quizId) || quizId < 1 || quizId > 50) return res.status(400).json({ success: false, message: 'Invalid quizId' });
  if (!EXAMS_CATALOG.find(e => e.id === examId)) return res.status(400).json({ success: false, message: 'Invalid examId' });
  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });

  try {
    const docId = examId === 'gcp-pca' ? `quiz_${quizId}` : `${examId}_quiz_${quizId}`;
    await firestore.collection('usuarios').doc(req.user.userId).collection('simulados_progresso').doc(docId).delete();
    res.json({ success: true, message: `Progresso removido`, examId });
  } catch (error) {
    res.status(500).json({ success: false, fallback: true, error: IS_PRODUCTION ? 'Erro' : error.message });
  }
};
