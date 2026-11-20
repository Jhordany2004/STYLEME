const { z } = require('zod');
const authService = require('../services/authService');
const { success } = require('../compartido/response');
const Usuario = require('../models/Usuario');

const registerSchema = z.object({ nombreCompleto: z.string().min(3).max(100), email: z.string().email(), password: z.string().min(8).max(100), telefono: z.string().max(30).optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

async function register(req, res, next) { try { const user = await authService.register(registerSchema.parse(req.body)); return success(res, user, 'Usuario registrado', 201); } catch (error) { return next(error); } }
async function login(req, res, next) { try { return success(res, await authService.login(loginSchema.parse(req.body)), 'Inicio de sesión exitoso'); } catch (error) { return next(error); } }
async function profile(req, res, next) { try { const user = await Usuario.findById(req.user.id); return success(res, authService.publicUser(user)); } catch (error) { return next(error); } }

module.exports = { register, login, profile };
