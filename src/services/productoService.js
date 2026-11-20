const Producto = require('../models/Producto');
const Tienda = require('../models/Tienda');
const { AppError } = require('../compartido/errors/AppError');

async function currentStore(ownerId) {
  const store = await Tienda.findOne({ idPropietario: ownerId });
  if (!store) throw new AppError(404, 'No tiene una tienda');
  if (store.estado !== 'ACTIVO') throw new AppError(403, 'La tienda debe estar activa');
  return store;
}

function ensureUniqueVariants(variantes) {
  const keys = variantes.map((item) => `${item.talla.toLowerCase()}-${item.color.toLowerCase()}`);
  if (new Set(keys).size !== keys.length) throw new AppError(422, 'No puede repetir talla y color en variantes');
}

async function createProduct(ownerId, data) {
  const store = await currentStore(ownerId);
  ensureUniqueVariants(data.variantes);
  return Producto.create({ ...data, idTienda: store._id });
}

module.exports = { currentStore, createProduct, ensureUniqueVariants };
