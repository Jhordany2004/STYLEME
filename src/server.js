const app = require('./app');
const { connectDatabase } = require('./config/database');
const { port } = require('./config/env');

connectDatabase()
  .then(() => app.listen(port, () => console.log(`STYLEME API ejecutándose en puerto ${port}`)))
  .catch((error) => { console.error('No se pudo iniciar la API', error); process.exit(1); });
