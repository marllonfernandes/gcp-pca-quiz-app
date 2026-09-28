const { firestore } = require('../config/firestore');
const { verifyGoogleToken, IS_PRODUCTION, GOOGLE_CLIENT_ID } = require('../middlewares/auth');

exports.getConfig = (req, res) => {
  res.json({ clientId: GOOGLE_CLIENT_ID });
};

exports.devLogin = async (req, res, next) => {
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
      const { Firestore } = require('@google-cloud/firestore');
      await firestore.collection('usuarios').doc(devUser.userId).set({
        ...devUser,
        updatedAt: Firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (dbErr) {
      console.warn('[Firestore] Aviso dev-login:', dbErr.message);
    }
  }

  res.json({ success: true, token: devToken, user: devUser });
};

exports.verify = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token de autenticação não fornecido.' });
  }

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
        const { Firestore } = require('@google-cloud/firestore');
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
};
