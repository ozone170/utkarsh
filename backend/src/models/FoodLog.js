import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

foodLogSchema.index({ userId: 1, date: 1 }, { unique: true });
// Activity API optimization indexes
foodLogSchema.index({ userId: 1, time: -1 }); // For user activity queries

export default mongoose.model('FoodLog', foodLogSchema);
