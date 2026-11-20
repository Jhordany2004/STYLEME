const { z } = require('zod');
const Producto = require('../models/Producto');
const { success } = require('../compartido/response');
const productoService = require('../services/productoService');

const productSchema = z.object({ nombre: z.string().min(3).max(150), descripcion: z.string().max(3000).optional(), idCategoria: z.string().length(24), imagenes: z.array(z.object({ idPublico: z.string(), urlSegura: z.string().url(), posicion: z.number().int().min(0) })).min(1), variantes: z.array(z.object({ talla: z.string().min(1), color: z.string().min(1), sku: z.string().optional(), precioCentimos: z.number().int().min(0), stockDisponible: z.number().int().min(0) })).min(1) });

async function listPublic(req, res, next) { try { const filters = { estado: 'ACTIVO' }; if (req.query.idCategoria) filters.idCategoria = req.query.idCategoria; if (req.query.idTienda) filters.idTienda = req.query.idTienda; if (req.query.q) filters.nombre = new RegExp(req.query.q, 'i'); return success(res, await Producto.find(filters).populate('idTienda', 'nombre slug').limit(50)); } catch (error) { return next(error); } }
async function detail(req, res, next) { try { const product = await Producto.findOne({ _id: req.params.id, estado: 'ACTIVO' }).populate('idTienda', 'nombre slug contacto'); return success(res, product); } catch (error) { return next(error); } }
async function create(req, res, next) { try { return success(res, await productoService.createProduct(req.user.id, productSchema.parse(req.body)), 'Producto creado como borrador', 201); } catch (error) { return next(error); } }
async function ownList(req, res, next) { try { const store = await productoService.currentStore(req.user.id); return success(res, await Producto.find({ idTienda: store._id })); } catch (error) { return next(error); } }
async function changeState(req, res, next) { try { const store = await productoService.currentStore(req.user.id); const { estado } = z.object({ estado: z.enum(['BORRADOR', 'ACTIVO', 'INACTIVO']) }).parse(req.body); const product = await Producto.findOneAndUpdate({ _id: req.params.id, idTienda: store._id }, { estado }, { new: true }); return success(res, product, 'Estado actualizado'); } catch (error) { return next(error); } }

module.exports = { listPublic, detail, create, ownList, changeState };
