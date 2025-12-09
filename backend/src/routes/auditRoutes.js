import express from 'express';
import { getAuditLogs } from '../../services/auditLogger.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get audit logs - Admin only
router.get('/', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { actorId, action, startDate, endDate, limit, skip } = req.query;
    
    const filters = {};
    if (actorId) filters.actorId = actorId;
    if (action) filters.action = action;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (limit) filters.limit = parseInt(limit);
    if (skip) filters.skip = parseInt(skip);

    const logs = await getAuditLogs(filters);
    
    res.json({
      logs,
      count: logs.length,
      filters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
