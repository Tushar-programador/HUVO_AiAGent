require('dotenv').config();

const env = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  MODEL_NAME: process.env.MODEL_NAME || 'gpt-4o-mini',
  APP_ENV: process.env.APP_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = env;
