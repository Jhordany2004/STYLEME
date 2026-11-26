const { z } = require('zod');
const chatService = require('../services/chatService');
const { success } = require('../compartido/response');

const enviarSchema = z.object({
  mensaje: z.string().trim().min(1, 'El mensaje no puede estar vacio').max(2000)
});

async function enviarGlobal(req, res, next) {
  try {
    const mensaje = await chatService.enviarGlobal(req.user.id, enviarSchema.parse(req.body));
    return success(res, mensaje, 'Mensaje enviado', 201);
  } catch (error) {
    return next(error);
  }
}

async function obtenerGlobal(req, res, next) {
  try {
    return success(res, await chatService.obtenerGlobal());
  } catch (error) {
    return next(error);
  }
}

module.exports = { enviarGlobal, obtenerGlobal };
