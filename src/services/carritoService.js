const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const { AppError } = require('../compartido/errors/AppError');

async function addLine(clientId, data) {
  const product = await Producto.findOne({ _id: data.idProducto, estado: 'ACTIVO' });
  const variant = product?.variantes.id(data.idVariante);
  if (!product || !variant || variant.stockDisponible < data.cantidad) {
    throw new AppError(409, 'Producto o variante no disponible');
  }

  const cart = await Carrito.findOneAndUpdate(
    { idCliente: clientId },
    { $setOnInsert: { idCliente: clientId } },
    { new: true, upsert: true }
  );
  const existing = cart.productos.find((line) => line.idProducto.equals(data.idProducto) && line.idVariante.equals(data.idVariante));
  if (existing) existing.cantidad = data.cantidad;
  else cart.productos.push(data);
  return cart.save();
}

async function getCart(clientId) {
  return Carrito.findOne({ idCliente: clientId }) || { idCliente: clientId, productos: [] };
}

async function removeLine(clientId, productId, variantId) {
  return Carrito.findOneAndUpdate({ idCliente: clientId }, { $pull: { productos: { idProducto: productId, idVariante: variantId } } }, { new: true });
}

module.exports = { addLine, getCart, removeLine };
