const jwt = require('jsonwebtoken');
const { jwtSecret, jwtIssuer, jwtAudience } = require('../../config/env');
const { AppError } = require('../errors/AppError');

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return next(new AppError(401, 'No autenticado'));

  try {
    const payload = jwt.verify(token, jwtSecret, { issuer: jwtIssuer, audience: jwtAudience });
    req.user = { id: payload.sub, roles: payload.roles || [] };
    return next();
  } catch (_error) {
    return next(new AppError(401, 'Token inválido o expirado'));
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.some((role) => req.user.roles.includes(role))) {
      return next(new AppError(403, 'No tiene permisos para esta acción'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize };
