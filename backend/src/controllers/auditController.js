import { Op, literal, fn } from 'sequelize'
import sequelize from '../config/database.js'
import Audit from '../models/Audit.js'
import User from '../models/User.js'

export const getAudits = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 7
  const page  = parseInt(req.query.page, 10)  || 1
  const offset = (page - 1) * limit

  const { rows, count } = await Audit.findAndCountAll({
    include: [{ model: User, attributes: ['nombre', 'email'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  })

  res.json({
    data: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  })
}

export const getTopActiveUsers = async (req, res) => {
  const top = await Audit.findAll({
    attributes: [
      'usuario_id',
      [fn('COUNT', '*'), 'acciones']
    ],
    include: [{ model: User, attributes: ['nombre', 'email'] }],
    group: ['usuario_id', 'User.id'],
    order: [literal('acciones DESC')],
    limit: 3
  })
  res.json(top)
}

export const updateAuditLikert = async (req, res) => {
  const { id } = req.params
  const { likert } = req.body
  if (likert < 1 || likert > 5) return res.status(400).json({ message: 'Likert entre 1 y 5' })

  const audit = await Audit.findByPk(id)
  if (!audit) return res.status(404).json({ message: 'Registro no encontrado' })

  await audit.update({ likert })
  res.json(audit)
}

export const getAuditStats = async (req, res) => {
  const { startDate, endDate } = req.query
  const where = {}
  if (startDate && endDate) {
    where.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  }

  const stats = await Audit.findAll({
    attributes: [
      'accion',
      [fn('COUNT', '*'), 'total']
    ],
    where,
    group: ['accion']
  })
  res.json(stats)
}

export const getUserTableStats = async (req, res) => {
  const { startDate, endDate } = req.query
  const where = {}
  if (startDate && endDate) {
    where.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  }
  const stats = await Audit.findAll({
    attributes: [
      'usuario_id',
      'tabla',
      [fn('COUNT', '*'), 'total']
    ],
    include: [{ model: User, attributes: ['nombre', 'email'] }],
    where,
    group: ['usuario_id', 'tabla', 'User.id'],
    order: [literal('total DESC')]
  })
  res.json(stats)
}

export const getDeletionStats = async (req, res) => {
  const { startDate, endDate } = req.query
  const where = { accion: 'eliminar' }
  if (startDate && endDate) {
    where.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  }
  const stats = await Audit.findAll({
    attributes: ['tabla', [fn('COUNT', '*'), 'total']],
    where,
    group: ['tabla'],
    order: [literal('total DESC')]
  })
  res.json(stats)
}
