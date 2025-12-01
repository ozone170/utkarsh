import Hall from '../models/Hall.js';

export const createHall = async (req, res) => {
  try {
    const { name, code, capacity } = req.body;
    const hall = await Hall.create({ name, code, capacity });
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
