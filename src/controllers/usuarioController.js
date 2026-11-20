const Usuario = require('../models/Usuario');
const { success } = require('../compartido/response');

async function listarParaChat(req, res, next) {
  try {
    const usuarios = await Usuario.find({ _id: { $ne: req.user.id }, estado: 'ACTIVO' })
      .select('_id nombreCompleto roles')
      .sort({ nombreCompleto: 1 })
      .limit(100);
    return success(res, usuarios);
  } catch (error) {
    return next(error);
  }
}

module.exports = { listarParaChat };
