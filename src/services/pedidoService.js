const crypto = require('crypto');
const mongoose = require('mongoose');
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const { reservationMinutes } = require('../config/env');
const { AppError } = require('../compartido/errors/AppError');

async function checkout(clientId, entrega) {
  const session = await mongoose.startSession();
  try {
    let orders;
    await session.withTransaction(async () => {
      const cart = await Carrito.findOne({ idCliente: clientId }).session(session);
      if (!cart?.productos.length) throw new AppError(422, 'El carrito está vacío');
      const grouped = new Map();
      for (const line of cart.productos) {
        const product = await Producto.findOne({ _id: line.idProducto, estado: 'ACTIVO' }).session(session);
        const variant = product?.variantes.id(line.idVariante);
        if (!product || !variant || variant.stockDisponible < line.cantidad) throw new AppError(409, 'Una variante ya no tiene stock suficiente');
        variant.stockDisponible -= line.cantidad;
        variant.stockReservado += line.cantidad;
        await product.save({ session });
        const item = { idProducto: product._id, idVariante: variant._id, nombre: product.nombre, imageUrl: product.imagenes[0]?.urlSegura, talla: variant.talla, color: variant.color, precioUnitarioCentimos: variant.precioCentimos, cantidad: line.cantidad, subtotalCentimos: variant.precioCentimos * line.cantidad };
        grouped.set(String(product.idTienda), [...(grouped.get(String(product.idTienda)) || []), item]);
      }
      const idGrupoCompra = crypto.randomUUID();
      orders = [];
      for (const [idTienda, products] of grouped) {
        const totalCentimos = products.reduce((total, item) => total + item.subtotalCentimos, 0);
        const order = await Pedido.create([{ numeroPedido: `ST-${Date.now()}-${crypto.randomInt(1000, 9999)}`, idGrupoCompra, idCliente: clientId, idTienda, productos: products, totalCentimos, entrega, reservaExpiraEn: new Date(Date.now() + reservationMinutes * 60_000), historialEstados: [{ hacia: 'PENDIENTE', idActor: clientId, en: new Date() }] }], { session });
        orders.push(order[0]);
      }
      cart.productos = [];
      await cart.save({ session });
    });
    return orders;
  } finally { await session.endSession(); }
}

module.exports = { checkout };
