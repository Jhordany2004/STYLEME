const MensajeChat = require('../models/MensajeChat');
const Usuario = require('../models/Usuario');
const { AppError } = require('../compartido/errors/AppError');

async function enviar(idAutor, { destinatarioId, mensaje }) {
  if (idAutor === destinatarioId) {
    throw new AppError(400, 'No puedes enviarte mensajes a ti mismo');
  }

  const [autor, destinatario] = await Promise.all([
    Usuario.findOne({ _id: idAutor, estado: 'ACTIVO' }),
    Usuario.findOne({ _id: destinatarioId, estado: 'ACTIVO' })
  ]);
  if (!autor) throw new AppError(401, 'Usuario no válido');
  if (!destinatario) throw new AppError(404, 'Destinatario no encontrado');

  return MensajeChat.create({
    autor: autor._id,
    nombreAutor: autor.nombreCompleto,
    destinatario: destinatario._id,
    mensaje
  });
}

async function conversacion(idUsuario, idOtroUsuario) {
  const otroUsuario = await Usuario.findById(idOtroUsuario).select('_id nombreCompleto estado');
  if (!otroUsuario || otroUsuario.estado !== 'ACTIVO') {
    throw new AppError(404, 'Usuario no encontrado');
  }

  return MensajeChat.find({
    $or: [
      { autor: idUsuario, destinatario: idOtroUsuario },
      { autor: idOtroUsuario, destinatario: idUsuario }
    ]
  }).sort({ fechaEnvio: 1 }).limit(100);
}

module.exports = { enviar, conversacion };
