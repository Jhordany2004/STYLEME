const { Schema, model } = require('mongoose');

const tiendaSchema = new Schema({
  idPropietario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  nombre: { type: String, required: true, trim: true },
  descripcion: String,
  contacto: { telefono: { type: String, required: true }, whatsapp: String, email: String },
  direccion: { direccionPrincipal: String, distrito: String, ciudad: String },
  estado: { type: String, enum: ['PENDIENTE', 'ACTIVO', 'RECHAZADA', 'SUSPENDIDA'], default: 'PENDIENTE' },
  motivoRechazo: String,
  motivoSuspension: String,
  aprobadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  aprobadoEn: Date
}, { timestamps: true, collection: 'tiendas' });

tiendaSchema.index({ estado: 1, createdAt: -1 });
module.exports = model('Tienda', tiendaSchema);
