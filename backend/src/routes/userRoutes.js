// src/routes/userRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,     // ← importado
  createUser,      // ← importado
  updateUser,
  deleteUser,
  changeUserRole
} from '../controllers/userController.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Protección: sólo admin
router.use(verifyToken, checkRole(['admin']));

// CRUD: Create, Read all, Read one, Update, Delete, Change role
router.post('/',      createUser);        // Crear usuario
router.get('/',       getAllUsers);       // Listar
router.get('/:id',    getUserById);       // Leer uno
router.put('/:id',    updateUser);        // Actualizar datos
router.delete('/:id', deleteUser);        // Eliminar
router.put('/:id/role', changeUserRole);  // Cambiar rol

export default router;

