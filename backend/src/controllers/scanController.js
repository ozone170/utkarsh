import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';

export const scanHall = async (req, res) => {
  try {
    const { eventId, hallCode } = req.body;
    
    const user = await User.findOne({ eventId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hall = await Hall.findOne({ code: hallCode, isActive: true });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or inactive' });
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

    const openLog = await HallLog.findOne({ userId: user._id, exitTime: null });

    if (!openLog) {
      await HallLog.create({
        userId: user._id,
        hallId: hall._id,
        entryTime: now,
        date,
        dayIndex
      });
      return res.json({ status: 'entry', message: `Entered ${hall.name}`, hall: hall.name });
    }

    if (openLog.hallId.toString() === hall._id.toString()) {
      openLog.exitTime = now;
      await openLog.save();
      return res.json({ status: 'exit', message: `Exited ${hall.name}`, hall: hall.name });
    }

    const previousHall = await Hall.findById(openLog.hallId);
    openLog.exitTime = now;
    await openLog.save();

    await HallLog.create({
      userId: user._id,
      hallId: hall._id,
      entryTime: now,
      date,
      dayIndex
    });

    return res.json({ 
      status: 'movement', 
      message: `Moved from ${previousHall.name} to ${hall.name}`,
      from: previousHall.name,
      to: hall.name
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scanFood = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    const user = await User.findOne({ eventId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const date = new Date().toISOString().split('T')[0];
    
    const existing = await FoodLog.findOne({ userId: user._id, date });
    if (existing) {
      return res.status(400).json({ 
        status: 'denied', 
        message: 'Food already claimed today' 
      });
    }

    await FoodLog.create({ userId: user._id, date });
    res.json({ status: 'allowed', message: 'Food claim successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
