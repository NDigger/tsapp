const { Pool } = require('pg');

const { DB_NAME, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_DEV_HOST, DB_PORT } = process.env;

console.log(DB_NAME, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_PORT)
const pool = new Pool({
  host: DB_HOST,       // имя сервиса в docker-compose
  port: DB_PORT,       // внутренний порт PostgreSQL
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: DB_NAME,
});

module.exports = { query: (text, params) => pool.query(text, params) };