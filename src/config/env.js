const fs = require('fs');

// En desarrollo admite la plantilla indicada si aún no existe un .env local.
require('dotenv').config({ path: fs.existsSync('.env') ? '.env' : '.env.example' });

const required = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'GEMINI_API_KEY',
  'GEMINI_MODEL'
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
}

module.exports = {
  port: 3000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtIssuer: 'styleme-api',
  jwtAudience: 'styleme-flutter',
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  reservationMinutes: 30,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL
};
