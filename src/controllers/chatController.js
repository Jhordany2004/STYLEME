const { z } = require('zod');
const chatService = require('../services/chatService');
const { success } = require('../compartido/response');

const enviarSchema = z.object({
  destinatarioId: z.string().regex(/^[a-f\d]{24}$/i, 'Destinatario inválido'),
  mensaje: z.string().trim().min(1, 'El mensaje no puede estar vacío').max(2000)
});

async function enviar(req, res, next) {
  try {
    const mensaje = await chatService.enviar(req.user.id, enviarSchema.parse(req.body));
    return success(res, mensaje, 'Mensaje enviado', 201);
  } catch (error) {
    return next(error);
  }
}

async function obtenerConversacion(req, res, next) {
  try {
    const idOtroUsuario = z.string().regex(/^[a-f\d]{24}$/i, 'Usuario inválido').parse(req.params.idUsuario);
    return success(res, await chatService.conversacion(req.user.id, idOtroUsuario));
  } catch (error) {
    return next(error);
  }
}

module.exports = { enviar, obtenerConversacion };
