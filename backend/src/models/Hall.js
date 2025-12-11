import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isFoodCounter: { type: Boolean, default: false }
});

// Indexes for performance optimization
// Note: code index automatically created by unique: true
hallSchema.index({ isActive: 1 }); // Filter active halls
hallSchema.index({ isFoodCounter: 1 }); // Filter food counters
hallSchema.index({ isActive: 1, isFoodCounter: 1 }); // Compound index for common queries

export default mongoose.model('Hall', hallSchema);
