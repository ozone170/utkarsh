import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  program: { type: String, required: true, index: true },
  year: { type: Number, required: true, min: 1, max: 4, index: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  section: { type: String, required: true, enum: ['A', 'B', 'C', 'D'], index: true },
  eventId: { type: String, required: true, unique: true },
  profilePhoto: {
    avatar: { type: String }, // 256x256 version for UI
    idCard: { type: String }  // 600x400 version for ID cards
  },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Compound indexes for common queries
userSchema.index({ program: 1, year: 1 });
userSchema.index({ section: 1, program: 1 });
userSchema.index({ createdAt: -1 }); // For sorting by newest first

export default mongoose.model('User', userSchema);
