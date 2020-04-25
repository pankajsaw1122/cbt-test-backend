const mysql = require('mysql2');

// local db
const pool = mysql.createPool({
    host: 'localhost',
  user: 'cbtuser',
  password: 'Cbtuser@1234',
  database: 'cbt-test',
  multipleStatements: true
});

// live db 
// const pool = mysql.createPool({
//     host: 'localhost',
//   user: 'cbtuser',
//   password: 'Cbt@7991#p@$$d',
//   database: 'cbt-test',
//   multipleStatements: true
// });
module.exports = pool.promise();


// Cbt@7991#p@$$d

// module.exports = pool;