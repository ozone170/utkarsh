import User from '../models/User.js';
import crypto from 'crypto';

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, branch, year } = req.body;
    
    const eventId = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    const user = await User.create({
      name,
      email,
      phone,
      branch,
      year,
      eventId
    });

    res.status(201).json({ user, eventId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUserByEventId = async (req, res) => {
  try {
    const user = await User.findOne({ eventId: req.params.eventId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


