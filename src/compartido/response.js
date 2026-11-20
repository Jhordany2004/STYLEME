function success(res, datos, mensaje = 'Operación realizada', status = 200, meta = null) {
  return res.status(status).json({ exito: true, mensaje, datos, meta });
}

module.exports = { success };
