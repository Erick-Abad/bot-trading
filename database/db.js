const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tradingbot'
});
conn.connect(err => {
  if (err) throw err;
  console.log("🗃️ Conectado a MySQL.");
});
module.exports = conn;
