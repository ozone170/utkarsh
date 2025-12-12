import mongoose from 'mongoose';

const hallLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true, index: true },
  entryTime: { type: Date, required: true, index: true },
  exitTime: { type: Date, index: true },
  date: { type: String, required: true, index: true },
  dayIndex: { type: Number, required: true }
});

// Compound indexes for common queries
hallLogSchema.index({ userId: 1, exitTime: 1 }); // For finding open logs
hallLogSchema.index({ hallId: 1, date: 1 }); // For hall occupancy by date
hallLogSchema.index({ date: 1, entryTime: -1 }); // For daily reports
// Activity API optimization indexes
hallLogSchema.index({ userId: 1, date: 1, entryTime: -1 }); // For user activity queries
hallLogSchema.index({ userId: 1, entryTime: -1 }); // For user activity without date filter

export default mongoose.model('HallLog', hallLogSchema);
