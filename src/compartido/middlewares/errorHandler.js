const { ZodError } = require('zod');
const { AppError } = require('../errors/AppError');

function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Datos inválidos',
      errores: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        code: issue.code,
        mensaje: issue.message
      })),
      requestId: req.requestId
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      exito: false,
      mensaje: error.message,
      errores: error.errors,
      requestId: req.requestId
    });
  }

  console.error(error);
  return res.status(500).json({ exito: false, mensaje: 'Error interno del servidor', requestId: req.requestId });
}

module.exports = { errorHandler };
