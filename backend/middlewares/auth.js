const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const authClient = new OAuth2Client(GOOGLE_CLIENT_ID || undefined);

async function verifyGoogleToken(idToken) {
  const ticket = await authClient.verifyIdToken({
    idToken: idToken,
    audience: GOOGLE_CLIENT_ID
  });
  return ticket.getPayload();
}

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

module.exports = {
  requireAuth,
  verifyGoogleToken,
  GOOGLE_CLIENT_ID,
  IS_PRODUCTION
};
