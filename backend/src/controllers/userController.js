// src/controllers/userController.js
import User from '../models/User.js';

// GET /api/users — listado ordenado por createdAt
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id','nombre','email','rol','createdAt']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

// PUT /api/users/:id — actualizar datos básicos (nombre, email)
export const updateUser = async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.nombre = nombre ?? user.nombre;
    user.email  = email  ?? user.email;
    if (rol) user.rol
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

// DELETE /api/users/:id — borrar usuario
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

// PUT /api/users/:id/role — cambiar rol
export const changeUserRole = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['admin','operador','usuario','auditor'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.rol = rol;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al cambiar rol', error: err.message });
  }
};


// Nuevo: GET /api/users/:id — datos de un usuario
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id','nombre','email','rol','createdAt']
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

// Nuevo: POST /api/users — crear usuario (rol por defecto "usuario")
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'usuario' } = req.body;
    // Sólo admin llega aquí, así que permitimos cualquier rol válido
    const newUser = await User.create({ nombre, email, password, rol });
    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol,
      createdAt: newUser.createdAt
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};
