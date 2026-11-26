const MensajeChat = require('../models/MensajeChat');
const Usuario = require('../models/Usuario');
const { AppError } = require('../compartido/errors/AppError');

async function enviarGlobal(idAutor, { mensaje }) {
  const autor = await Usuario.findOne({ _id: idAutor, estado: 'ACTIVO' });
  if (!autor) throw new AppError(401, 'Usuario no valido');

  return MensajeChat.create({
    autor: autor._id,
    nombreAutor: autor.nombreCompleto,
    mensaje
  });
}

async function obtenerGlobal() {
  // Se consulta en orden inverso para aprovechar el indice y se devuelve
  // cronologicamente, como debe mostrarse en la interfaz.
  const mensajes = await MensajeChat.find({ destinatario: { $exists: false } })
    .sort({ fechaEnvio: -1 })
    .limit(200);
  return mensajes.reverse();
}

module.exports = { enviarGlobal, obtenerGlobal };
