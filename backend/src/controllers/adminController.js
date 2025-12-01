import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';
import AdminUser from '../models/AdminUser.js';

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
      .populate('userId', 'name email eventId branch year phone')
      .populate('hallId', 'name code');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVolunteer = async (req, res) => {
  try {
    const { name, email, password, assignedHall } = req.body;
    
    if (!assignedHall) {
      return res.status(400).json({ message: 'Assigned hall is required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const volunteer = await AdminUser.create({
      name,
      email,
      passwordHash,
      role: 'VOLUNTEER',
      assignedHalls: [assignedHall]
    });

    const populatedVolunteer = await AdminUser.findById(volunteer._id)
      .populate('assignedHalls', 'name code');

    res.status(201).json(populatedVolunteer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await AdminUser.find({ role: 'VOLUNTEER' })
      .populate('assignedHalls', 'name code')
      .select('-passwordHash');
    
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { name, email, assignedHall } = req.body;
    
    const updateData = { name, email };
    if (assignedHall) {
      updateData.assignedHalls = [assignedHall];
    }
    
    const volunteer = await AdminUser.findByIdAndUpdate(
      volunteerId,
      updateData,
      { new: true }
    ).populate('assignedHalls', 'name code');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    
    const volunteer = await AdminUser.findByIdAndDelete(volunteerId);
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
