const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
  user: 'cbtuser',
  password: 'Cbtuser@1234',
  database: 'cbt-test'
});


module.exports = pool.promise();

// module.exports = pool;