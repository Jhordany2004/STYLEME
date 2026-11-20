const { Schema, model } = require('mongoose');

const varianteSchema = new Schema({
  sku: String,
  talla: { type: String, required: true },
  color: { type: String, required: true },
  precioCentimos: { type: Number, required: true, min: 0 },
  stockDisponible: { type: Number, required: true, min: 0 },
  stockReservado: { type: Number, default: 0, min: 0 }
});

const productoSchema = new Schema({
  idTienda: { type: Schema.Types.ObjectId, ref: 'Tienda', required: true },
  idCategoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  nombre: { type: String, required: true, trim: true },
  descripcion: String,
  estado: { type: String, enum: ['BORRADOR', 'ACTIVO', 'INACTIVO', 'MODERADO'], default: 'BORRADOR' },
  imagenes: [{ idPublico: String, urlSegura: String, posicion: Number }],
  variantes: [varianteSchema]
}, { timestamps: true, collection: 'productos' });

productoSchema.index({ idTienda: 1, estado: 1, createdAt: -1 });
productoSchema.index({ estado: 1, idCategoria: 1, createdAt: -1 });
module.exports = model('Producto', productoSchema);
