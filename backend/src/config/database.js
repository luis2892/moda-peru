const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'moda_peru',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00',
})

pool.getConnection()
  .then((conn) => {
    console.log('✅ Conectado a MySQL')
    conn.release()
  })
  .catch((err) => console.error('❌ Error de conexión MySQL:', err.message))

module.exports = pool
