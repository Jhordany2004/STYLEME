const { Schema, model } = require('mongoose');

const carritoSchema = new Schema({
  idCliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  productos: [{ idProducto: Schema.Types.ObjectId, idVariante: Schema.Types.ObjectId, cantidad: Number }]
}, { timestamps: true, collection: 'carritos' });

module.exports = model('Carrito', carritoSchema);
