// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Agregar esta línea

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configurado para desarrollo
app.use(cors({
  origin: 'http://localhost:5173', // Puerto por defecto de Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/users', userRoutes);

// Ruta para crear usuario admin inicial
app.post('/api/init-admin', async (req, res) => {
  try {
    const { User } = await import('./models/User.js');
    
    const adminExists = await User.default.findOne({ 
      where: { email: 'admin@admin.com' } 
    });
    
    if (adminExists) {
      return res.json({ message: 'Admin ya existe' });
    }

    await User.default.create({
      nombre: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
      rol: 'admin'
    });
    
    res.json({ message: 'Usuario admin creado: admin@admin.com / admin123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Inicialización
const initServer = async () => {
  try {
    await sequelize.sync();
    console.log('Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`Frontend React debería correr en http://localhost:5173`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

initServer();