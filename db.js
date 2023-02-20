const Pool = require ('pg').Pool;
const pool = new Pool ({
  user: 'postgres',
  password: 'FzZ3v8vZLpu3kQG',
  database: 'json_express_db',
  host: 'localhost',
  port: '5433',
});

module.exports = pool;
