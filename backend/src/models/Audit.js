import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

const Audit = sequelize.define('Audit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  accion: { type: DataTypes.ENUM('crear', 'editar', 'eliminar', 'consultar'), allowNull: false },
  tabla : { type: DataTypes.STRING, allowNull: false },
  detalle: DataTypes.TEXT,
  ip     : DataTypes.STRING,
  likert : { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } }
})

Audit.belongsTo(User, {
  foreignKey: { name: 'usuario_id', allowNull: false },
  onDelete  : 'CASCADE',           //  ← punto clave
  hooks     : true                 //  ← necesario para SQLite / Sequelize
})

export default Audit
