const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1979',
  host: 'localhost',
  port: 5432,
  database: 'tsapp'
});

module.exports = { query: (text, params) => pool.query(text, params) };