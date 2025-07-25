import express from 'express'
import {
  getAudits,
  updateAuditLikert,
  getAuditStats,
  getTopActiveUsers
} from '../controllers/auditController.js'
import { verifyToken, checkRole } from '../middleware/auth.js'

const router = express.Router()

router.use(verifyToken)

router.get('/',               checkRole(['auditor', 'admin']), getAudits)
router.get('/top-active',     checkRole(['auditor', 'admin']), getTopActiveUsers)
router.get('/stats',          checkRole(['auditor', 'admin']), getAuditStats)
router.put('/:id/likert',     checkRole(['auditor']),          updateAuditLikert)

export default router
