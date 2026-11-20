const router = require('express').Router();
const auth = require('../controllers/authController');
const tiendas = require('../controllers/tiendaController');
const productos = require('../controllers/productoController');
const carrito = require('../controllers/carritoController');
const pedidos = require('../controllers/pedidoController');
const chats = require('../controllers/chatController');
const perfilEstilo = require('../controllers/perfilEstiloController');
const usuarios = require('../controllers/usuarioController');
const Categoria = require('../models/Categoria');
const { success } = require('../compartido/response');
const { authenticate, authorize } = require('../compartido/middlewares/auth');

router.post('/autenticacion/registrar', auth.register);
router.post('/autenticacion/iniciar-sesion', auth.login);
router.get('/usuarios/mi-perfil', authenticate, auth.profile);
router.get('/usuarios', authenticate, usuarios.listarParaChat);

router.get('/tiendas', tiendas.listPublic);
router.post('/tiendas', authenticate, authorize('CLIENTE'), tiendas.create);
router.get('/vendedor/tienda', authenticate, tiendas.own);
router.patch('/vendedor/tienda', authenticate, tiendas.updateOwn);

router.get('/categorias', async (req, res, next) => { try { return success(res, await Categoria.find({ estaActiva: true }).sort({ ordenVisualizacion: 1 })); } catch (error) { return next(error); } });
router.get('/productos', productos.listPublic);
router.get('/productos/:id', productos.detail);
router.get('/vendedor/productos', authenticate, authorize('VENDEDOR'), productos.ownList);
router.post('/vendedor/productos', authenticate, authorize('VENDEDOR'), productos.create);
router.patch('/vendedor/productos/:id/estado', authenticate, authorize('VENDEDOR'), productos.changeState);
router.patch('/administracion/tiendas/:id/estado', authenticate, authorize('ADMINISTRADOR'), tiendas.changeStatus);
router.get('/carrito', authenticate, authorize('CLIENTE'), carrito.get);
router.put('/carrito/productos', authenticate, authorize('CLIENTE'), carrito.put);
router.delete('/carrito/productos/:idProducto/:idVariante', authenticate, authorize('CLIENTE'), carrito.remove);
router.post('/pedidos/confirmar-compra', authenticate, authorize('CLIENTE'), pedidos.checkout);
router.get('/pedidos', authenticate, authorize('CLIENTE'), pedidos.list);

// Disponible para clientes, vendedores y administradores autenticados.
router.post('/chats/mensajes', authenticate, chats.enviar);
router.get('/chats/conversaciones/:idUsuario/mensajes', authenticate, chats.obtenerConversacion);
router.post('/test-estilo/analizar', authenticate, perfilEstilo.analizar);

module.exports = router;
