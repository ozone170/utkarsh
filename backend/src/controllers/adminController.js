import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';

export const getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHalls = await Hall.countDocuments();
    
    const today = new Date().toISOString().split('T')[0];
    const foodToday = await FoodLog.countDocuments({ date: today });
    
    const activeInHalls = await HallLog.countDocuments({ exitTime: null });

    res.json({
      totalUsers,
      totalHalls,
      foodClaimedToday: foodToday,
      currentlyInHalls: activeInHalls
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHallOccupancy = async (req, res) => {
  try {
    const { hallId, date } = req.query;
    
    const query = { exitTime: null };
    if (hallId) query.hallId = hallId;
    if (date) query.date = date;

    const logs = await HallLog.find(query)
      .populate('userId', 'name email eventId')
      .populate('hallId', 'name code');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
