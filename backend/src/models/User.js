import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true, default: 1 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  section: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
  eventId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
