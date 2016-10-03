var mysql = require('mysql');

function createDBConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ppd01982',
    database: 'payfast'
  });
}

module.exports = function() {
  return createDBConnection;
}