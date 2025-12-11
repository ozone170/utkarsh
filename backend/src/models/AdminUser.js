import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'SCANNER', 'VOLUNTEER'], required: true },
  assignedHalls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hall' }],
  profilePhoto: {
    avatar: { type: String }, // 256x256 version for UI
    idCard: { type: String }  // 600x400 version for ID cards
  }
});

// Indexes for performance optimization
// Note: email index automatically created by unique: true
adminUserSchema.index({ role: 1 }); // Filter by role (ADMIN, SCANNER, VOLUNTEER)
adminUserSchema.index({ assignedHalls: 1 }); // Query users by assigned halls

export default mongoose.model('AdminUser', adminUserSchema);
