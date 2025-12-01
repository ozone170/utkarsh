import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'SCANNER', 'VOLUNTEER'], required: true },
  assignedHalls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hall' }]
});

export default mongoose.model('AdminUser', adminUserSchema);
