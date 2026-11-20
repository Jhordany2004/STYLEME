const { z } = require('zod');
const pedidoService = require('../services/pedidoService');
const Pedido = require('../models/Pedido');
const { success } = require('../compartido/response');
const { AppError } = require('../compartido/errors/AppError');

const deliverySchema = z.object({ entrega: z.object({ destinatario: z.string().min(2), telefono: z.string().min(6), direccionTexto: z.string().min(5), notas: z.string().max(500).optional() }) });
async function checkout(req, res, next) {
  try {
    if (!req.headers['idempotency-key']) throw new AppError(400, 'Idempotency-Key es obligatorio');
    const orders = await pedidoService.checkout(req.user.id, deliverySchema.parse(req.body).entrega);
    return success(res, { pedidos: orders }, 'Pedidos registrados', 201);
  } catch (error) { return next(error); }
}
async function list(req, res, next) { try { return success(res, await Pedido.find({ idCliente: req.user.id }).sort({ createdAt: -1 })); } catch (error) { return next(error); } }
module.exports = { checkout, list };
