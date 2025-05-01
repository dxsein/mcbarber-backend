const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite conexiones desde otros orígenes (como Vercel)
app.use(express.json()); // Permite leer datos JSON en las peticiones

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
  } else {
    console.log('✅ Conexión a la base de datos exitosa');

    // Crear la tabla reservas si no existe
    const crearTablaSQL = `
      CREATE TABLE IF NOT EXISTS reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        fecha DATE,
        hora TIME
      )
    `;
    db.query(crearTablaSQL, (err, result) => {
      if (err) {
        console.error('❌ Error al crear la tabla:', err);
      } else {
        console.log('✅ Tabla "reservas" verificada/creada');
      }
    });
  }
});

// Ruta de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
  res.send('Servidor MC BARBER funcionando');
});

// Ruta para recibir las reservas desde el formulario
app.post('/api/reservas', (req, res) => {
  const { nombre, fecha, hora } = req.body;

  const sql = 'INSERT INTO reservas (nombre, fecha, hora) VALUES (?, ?, ?)';
  db.query(sql, [nombre, fecha, hora], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar la reserva:', err);
      res.status(500).json({ error: 'Error al guardar la reserva' });
    } else {
      res.status(200).json({ mensaje: '✅ Reserva guardada exitosamente' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
