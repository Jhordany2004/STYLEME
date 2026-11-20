const { Schema, model } = require('mongoose');

const pedidoSchema = new Schema({
  numeroPedido: { type: String, required: true, unique: true },
  idGrupoCompra: { type: String, required: true },
  idCliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  idTienda: { type: Schema.Types.ObjectId, ref: 'Tienda', required: true },
  productos: [{ idProducto: Schema.Types.ObjectId, idVariante: Schema.Types.ObjectId, nombre: String, imageUrl: String, talla: String, color: String, precioUnitarioCentimos: Number, cantidad: Number, subtotalCentimos: Number }],
  moneda: { type: String, default: 'PEN' },
  totalCentimos: Number,
  estado: { type: String, enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO', 'EXPIRADO'], default: 'PENDIENTE' },
  entrega: { destinatario: String, telefono: String, direccionTexto: String, notas: String },
  reservaExpiraEn: Date,
  historialEstados: [{ desde: String, hacia: String, idActor: Schema.Types.ObjectId, en: Date }]
}, { timestamps: true, collection: 'pedidos' });

pedidoSchema.index({ idTienda: 1, estado: 1, createdAt: -1 });
pedidoSchema.index({ idCliente: 1, createdAt: -1 });
module.exports = model('Pedido', pedidoSchema);
