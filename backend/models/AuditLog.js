import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AdminUser', 
    required: true 
  },
  actorName: { 
    type: String, 
    required: true 
  },
  actorRole: { 
    type: String, 
    enum: ['ADMIN', 'SCANNER', 'VOLUNTEER', 'USER'], 
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: [
      'SCAN_HALL_ENTRY',
      'SCAN_HALL_EXIT',
      'SCAN_HALL_MOVEMENT',
      'SCAN_FOOD_ALLOWED',
      'SCAN_FOOD_DENIED',
      'STUDENT_CREATE',
      'STUDENT_UPDATE',
      'STUDENT_DELETE',
      'HALL_CREATE',
      'HALL_UPDATE',
      'HALL_DELETE',
      'VOLUNTEER_CREATE',
      'VOLUNTEER_UPDATE',
      'VOLUNTEER_DELETE',
      'PROFILE_UPDATE',
      'PASSWORD_CHANGE',
      'PHOTO_UPLOAD',
      'PHOTO_REMOVE',
      'CERTIFICATE_GENERATED',
      'BULK_CERTIFICATES_GENERATED'
    ]
  },
  resource: { 
    type: String, 
    required: true 
  },
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String 
  }
});

// Index for efficient querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ actorId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
