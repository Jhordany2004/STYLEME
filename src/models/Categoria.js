const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  idPadre: { type: Schema.Types.ObjectId, ref: 'Categoria' },
  estaActiva: { type: Boolean, default: true },
  ordenVisualizacion: { type: Number, default: 0 }
}, { timestamps: true, collection: 'categorias' });

module.exports = model('Categoria', categoriaSchema);
