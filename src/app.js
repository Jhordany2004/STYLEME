const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { requestId } = require('./compartido/middlewares/requestId');
const { errorHandler } = require('./compartido/middlewares/errorHandler');
const routes = require('./routes');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.get('/health', (req, res) => res.json({ exito: true, mensaje: 'STYLEME API operativa' }));
app.use('/api/v1', routes);
app.use(errorHandler);

module.exports = app;
