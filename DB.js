const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '4938',  // test local DB 비밀번호
  host: 'localhost',
  port: 5432,
  database: 'login_testDB',
});

module.exports = pool;