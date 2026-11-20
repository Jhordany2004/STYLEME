const { Schema, model } = require('mongoose');

const mensajeChatSchema = new Schema({
  autor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  nombreAutor: { type: String, required: true, trim: true, maxlength: 100 },
  destinatario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  mensaje: { type: String, required: true, trim: true, maxlength: 2000 }
}, {
  timestamps: { createdAt: 'fechaEnvio', updatedAt: false },
  collection: 'mensajes_chat'
});

mensajeChatSchema.index({ autor: 1, destinatario: 1, fechaEnvio: -1 });
mensajeChatSchema.index({ destinatario: 1, autor: 1, fechaEnvio: -1 });

module.exports = model('MensajeChat', mensajeChatSchema);
