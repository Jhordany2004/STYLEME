const { z } = require('zod');
const perfilEstiloService = require('../services/perfilEstiloService');
const { success } = require('../compartido/response');

const respuestasSchema = z.object({
  respuestas: z.array(z.object({
    pregunta: z.number().int().min(1).max(25),
    respuesta: z.string().trim().min(1).max(200)
  })).min(1).max(25)
});

async function analizar(req, res, next) {
  try {
    const { respuestas } = respuestasSchema.parse(req.body);
    return success(res, await perfilEstiloService.analizar(respuestas), 'Perfil de estilo generado');
  } catch (error) {
    return next(error);
  }
}

module.exports = { analizar };
