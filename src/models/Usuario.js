const { Schema, model } = require('mongoose');

const direccionSchema = new Schema({
  etiqueta: String,
  destinatario: { type: String, required: true },
  telefono: { type: String, required: true },
  direccionPrincipal: { type: String, required: true },
  distrito: String,
  ciudad: String,
  referencia: String,
  esPredeterminada: Boolean
});

const usuarioSchema = new Schema({
  nombreCompleto: { type: String, required: true, trim: true },
  correoNormalizado: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hashContrasena: { type: String, required: true, select: false },
  telefono: String,
  roles: { type: [String], enum: ['CLIENTE', 'VENDEDOR', 'ADMINISTRADOR'], default: ['CLIENTE'] },
  estado: { type: String, enum: ['ACTIVO', 'BLOQUEADO'], default: 'ACTIVO' },
  direcciones: { type: [direccionSchema], default: [] }
}, { timestamps: true, collection: 'usuarios' });

module.exports = model('Usuario', usuarioSchema);
