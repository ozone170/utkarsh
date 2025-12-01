import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';

export const createHall = async (req, res) => {
  try {
    const { name, code, capacity, isFoodCounter } = req.body;
    const hall = await Hall.create({ name, code, capacity, isFoodCounter: isFoodCounter || false });
    res.status(201).json(hall);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Hall code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getHalls = async (req, res) => {
  try {
    const halls = await Hall.find();
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const { name, code, capacity, isActive, isFoodCounter } = req.body;
    
    const hall = await Hall.findByIdAndUpdate(
      hallId,
      { name, code, capacity, isActive, isFoodCounter },
      { new: true, runValidators: true }
    );

    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    res.json(hall);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Hall code already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    
    const hall = await Hall.findByIdAndDelete(hallId);
    
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Also delete related logs
    await HallLog.deleteMany({ hallId });

    res.json({ message: 'Hall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
