const { z } = require('zod');
const carritoService = require('../services/carritoService');
const { success } = require('../compartido/response');

const lineSchema = z.object({ idProducto: z.string().length(24), idVariante: z.string().length(24), cantidad: z.number().int().min(1).max(20) });

async function get(req, res, next) { try { return success(res, await carritoService.getCart(req.user.id)); } catch (error) { return next(error); } }
async function put(req, res, next) { try { return success(res, await carritoService.addLine(req.user.id, lineSchema.parse(req.body)), 'Carrito actualizado'); } catch (error) { return next(error); } }
async function remove(req, res, next) { try { return success(res, await carritoService.removeLine(req.user.id, req.params.idProducto, req.params.idVariante), 'Producto eliminado'); } catch (error) { return next(error); } }

module.exports = { get, put, remove };
