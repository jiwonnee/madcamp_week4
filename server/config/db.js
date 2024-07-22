const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '34.22.83.24',
  user: 'madcamp4',
  password: process.env.DB_PASSWORD,
  database: 'allrounder',
});

module.exports = db;