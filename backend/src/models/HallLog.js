import mongoose from 'mongoose';

const hallLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  date: { type: String, required: true },
  dayIndex: { type: Number, required: true }
});

export default mongoose.model('HallLog', hallLogSchema);
