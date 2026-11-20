const { z } = require('zod');
const Tienda = require('../models/Tienda');
const { success } = require('../compartido/response');
const tiendaService = require('../services/tiendaService');

const storeSchema = z.object({ nombre: z.string().min(3).max(100), descripcion: z.string().max(1000).optional(), contacto: z.object({ telefono: z.string().min(6), whatsapp: z.string().optional(), email: z.string().email().optional() }), direccion: z.object({ direccionPrincipal: z.string().optional(), distrito: z.string().optional(), ciudad: z.string().optional() }).optional() });

async function create(req, res, next) { try { return success(res, await tiendaService.createStore(req.user.id, storeSchema.parse(req.body)), 'Tienda enviada a revisión', 201); } catch (error) { return next(error); } }
async function listPublic(req, res, next) { try { return success(res, await Tienda.find({ estado: 'ACTIVO' }).select('nombre slug descripcion contacto').limit(50)); } catch (error) { return next(error); } }
async function own(req, res, next) { try { return success(res, await Tienda.findOne({ idPropietario: req.user.id })); } catch (error) { return next(error); } }
async function updateOwn(req, res, next) { try { const store = await Tienda.findOneAndUpdate({ idPropietario: req.user.id }, storeSchema.partial().parse(req.body), { new: true }); return success(res, store, 'Tienda actualizada'); } catch (error) { return next(error); } }
async function changeStatus(req, res, next) { try { const body = z.object({ estado: z.enum(['ACTIVO', 'RECHAZADA', 'SUSPENDIDA']), motivo: z.string().max(500).optional() }).parse(req.body); return success(res, await tiendaService.changeStoreStatus(req.params.id, req.user.id, body.estado, body.motivo), 'Estado actualizado'); } catch (error) { return next(error); } }

module.exports = { create, listPublic, own, updateOwn, changeStatus };
