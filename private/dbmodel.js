const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,       // имя сервиса в docker-compose
  port: process.env.DB_PORT,       // внутренний порт PostgreSQL
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

module.exports = { query: (text, params) => pool.query(text, params)};