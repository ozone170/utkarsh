import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  isFoodCounter: { type: Boolean, default: false }
});

export default mongoose.model('Hall', hallSchema);
