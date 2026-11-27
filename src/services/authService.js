const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { AppError } = require('../compartido/errors/AppError');
const {
  jwtSecret,
  jwtRefreshSecret,
  jwtIssuer,
  jwtAudience,
  accessTokenExpiresIn,
  refreshTokenExpiresIn
} = require('../config/env');

function publicUser(user) {
  return { id: user._id, nombreCompleto: user.nombreCompleto, email: user.correoNormalizado, telefono: user.telefono, apellidos: user.apellidos, edad: user.edad, documento: user.documento, direccion: user.direccion, roles: user.roles, estado: user.estado, direcciones: user.direcciones };
}

function createAccessToken(user) {
  return jwt.sign(
    { roles: user.roles, tipo: 'access' },
    jwtSecret,
    { subject: user._id.toString(), issuer: jwtIssuer, audience: jwtAudience, expiresIn: accessTokenExpiresIn }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { tipo: 'refresh' },
    jwtRefreshSecret,
    { subject: user._id.toString(), issuer: jwtIssuer, audience: jwtAudience, expiresIn: refreshTokenExpiresIn }
  );
}

async function register(data) {
  const email = data.email.toLowerCase().trim();
  if (await Usuario.exists({ correoNormalizado: email })) throw new AppError(409, 'El correo ya está registrado');
  const hashContrasena = await argon2.hash(data.password, { type: argon2.argon2id });
  const user = await Usuario.create({ nombreCompleto: data.nombreCompleto, correoNormalizado: email, hashContrasena, telefono: data.telefono, apellidos: data.apellidos, edad: data.edad, documento: data.documento, direccion: data.direccion, roles: [data.rol] });
  return publicUser(user);
}

async function login({ email, password }) {
  const user = await Usuario.findOne({ correoNormalizado: email.toLowerCase().trim() }).select('+hashContrasena');
  if (!user || user.estado !== 'ACTIVO' || !(await argon2.verify(user.hashContrasena, password))) throw new AppError(401, 'Credenciales inválidas');
  return {
    tokenAcceso: createAccessToken(user),
    tokenRenovacion: createRefreshToken(user),
    user: publicUser(user)
  };
}

async function renovarSesion(tokenRenovacion) {
  let datos;
  try {
    datos = jwt.verify(tokenRenovacion, jwtRefreshSecret, {
      issuer: jwtIssuer,
      audience: jwtAudience
    });
  } catch (_) {
    throw new AppError(401, 'La sesion ha expirado. Inicia sesion nuevamente');
  }
  if (datos.tipo !== 'refresh') {
    throw new AppError(401, 'Token de renovacion invalido');
  }

  const user = await Usuario.findById(datos.sub);
  if (!user || user.estado !== 'ACTIVO') {
    throw new AppError(401, 'Usuario no valido');
  }
  return {
    tokenAcceso: createAccessToken(user),
    tokenRenovacion: createRefreshToken(user),
    user: publicUser(user)
  };
}

module.exports = { register, login, renovarSesion, publicUser };
