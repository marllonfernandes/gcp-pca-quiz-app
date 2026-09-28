const { firestore } = require('../config/firestore');
const { EXAMS_CATALOG } = require('../config/exams');
const { sanitizeObjectKeys } = require('../utils/validator');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

exports.saveResult = async (req, res, next) => {
  let { examId, quizId, quizTitle, mode, scorePercentage, correctCount, wrongCount, unansweredCount, totalQuestions, timeElapsed, timeSpentFormatted, breakdown } = req.body;
  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });

  const selectedExamId = String(examId || 'gcp-pca').toLowerCase();
  if (!EXAMS_CATALOG.find(e => e.id === selectedExamId)) return res.status(400).json({ success: false, message: 'Invalid examId' });

  breakdown = sanitizeObjectKeys(breakdown, 50);

  try {
    const docRef = firestore.collection('usuarios').doc(req.user.userId).collection('exames_resultados').doc();
    const payload = {
      userId: req.user.userId, userEmail: req.user.email, userName: req.user.name,
      examId: selectedExamId, quizId: Number(quizId), quizTitle: String(quizTitle || `Simulado ${quizId}`),
      mode: mode === 'exame' ? 'exame' : 'simulado', scorePercentage: Number(scorePercentage) || 0,
      passed: Number(scorePercentage) >= 70, correctCount: Number(correctCount) || 0, wrongCount: Number(wrongCount) || 0,
      unansweredCount: Number(unansweredCount) || 0, totalQuestions: Number(totalQuestions) || 60,
      timeElapsed: Number(timeElapsed) || 0, timeSpentFormatted: String(timeSpentFormatted || '00:00:00'),
      breakdown: breakdown || {}, completedAt: new Date().toISOString(), createdAt: require('@google-cloud/firestore').FieldValue.serverTimestamp()
    };
    await docRef.set(payload);
    res.json({ success: true, id: docRef.id, examId: selectedExamId, message: 'Resultado gravado' });
  } catch (error) {
    next(error);
  }
};

exports.listResults = async (req, res, next) => {
  if (!firestore) return res.status(503).json({ success: false, fallback: true, message: 'Firestore not available' });
  const requestedExamId = req.query.examId ? String(req.query.examId).toLowerCase() : null;

  try {
    const snapshot = await firestore.collection('usuarios').doc(req.user.userId).collection('exames_resultados').orderBy('completedAt', 'desc').limit(50).get();
    const results = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const itemExamId = data.examId || 'gcp-pca';
      if (!requestedExamId || requestedExamId === itemExamId) results.push({ id: doc.id, examId: itemExamId, ...data });
    });
    res.json({ success: true, examId: requestedExamId || 'all', results });
  } catch (error) {
    next(error);
  }
};
