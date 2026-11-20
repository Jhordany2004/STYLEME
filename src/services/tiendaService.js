const Tienda = require('../models/Tienda');
const Usuario = require('../models/Usuario');
const { AppError } = require('../compartido/errors/AppError');

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function createStore(ownerId, data) {
  if (await Tienda.exists({ idPropietario: ownerId })) throw new AppError(409, 'Solo puede tener una tienda');
  let slug = slugify(data.nombre);
  if (await Tienda.exists({ slug })) slug = `${slug}-${Date.now()}`;
  return Tienda.create({ ...data, slug, idPropietario: ownerId });
}

async function changeStoreStatus(storeId, adminId, estado, motivo) {
  const store = await Tienda.findById(storeId);
  if (!store) throw new AppError(404, 'Tienda no encontrada');
  if (['RECHAZADA', 'SUSPENDIDA'].includes(estado) && !motivo) throw new AppError(422, 'El motivo es obligatorio');
  store.estado = estado;
  if (estado === 'ACTIVO') {
    store.aprobadoPor = adminId;
    store.aprobadoEn = new Date();
    await Usuario.findByIdAndUpdate(store.idPropietario, { $addToSet: { roles: 'VENDEDOR' } });
  }
  if (estado === 'RECHAZADA') store.motivoRechazo = motivo;
  if (estado === 'SUSPENDIDA') store.motivoSuspension = motivo;
  return store.save();
}

module.exports = { createStore, changeStoreStatus };
