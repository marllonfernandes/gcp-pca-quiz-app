const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  
  if (!IS_PRODUCTION) {
    console.error(err.stack);
  }

  // Handle specific errors if needed (e.g., custom error classes)
  const statusCode = err.statusCode || 500;
  const message = IS_PRODUCTION ? 'Ocorreu um erro interno no servidor.' : err.message;

  res.status(statusCode).json({
    success: false,
    fallback: true,
    error: message
  });
}

module.exports = errorHandler;
