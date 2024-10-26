const mysql = require('mysql2/promise');


// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root', 
  password: 'Pizzalover2003', 
  database: 'care', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



module.exports = pool;

