import AuditLog from '../models/AuditLog.js';

/**
 * Log an audit event
 * @param {Object} params - Audit log parameters
 * @param {string} params.actorId - ID of the user performing the action
 * @param {string} params.actorName - Name of the user
 * @param {string} params.actorRole - Role of the user (ADMIN, SCANNER, VOLUNTEER)
 * @param {string} params.action - Action performed
 * @param {string} params.resource - Resource affected
 * @param {string} params.resourceId - ID of the resource
 * @param {Object} params.details - Additional details
 * @param {string} params.ipAddress - IP address of the request
 */
export const logAudit = async (params) => {
  try {
    await AuditLog.create({
      actorId: params.actorId,
      actorName: params.actorName,
      actorRole: params.actorRole,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.ipAddress,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging audit:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

/**
 * Get audit logs with filters
 * @param {Object} filters - Query filters
 * @param {string} filters.actorId - Filter by actor
 * @param {string} filters.action - Filter by action
 * @param {Date} filters.startDate - Filter by start date
 * @param {Date} filters.endDate - Filter by end date
 * @param {number} filters.limit - Limit results
 * @param {number} filters.skip - Skip results
 */
export const getAuditLogs = async (filters = {}) => {
  const query = {};
  
  if (filters.actorId) query.actorId = filters.actorId;
  if (filters.action) query.action = filters.action;
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = filters.startDate;
    if (filters.endDate) query.timestamp.$lte = filters.endDate;
  }

  return await AuditLog.find(query)
    .populate('actorId', 'name email role')
    .sort({ timestamp: -1 })
    .limit(filters.limit || 100)
    .skip(filters.skip || 0);
};
