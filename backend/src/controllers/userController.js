import User from '../models/User.js';
import crypto from 'crypto';
import { isAllowed } from '../../services/allowedList.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const year = 1; // All students are first year for UTKARSH 2025
    const branch = 'MBA'; // All students are MBA
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if student is in the allowlist
    const studentData = { name, email, phone };
    console.log('🔐 Validating student registration:', studentData);
    
    if (!isAllowed(studentData)) {
      console.log('❌ Registration BLOCKED - Student not in allowlist');
      return res.status(403).json({ 
        error: 'Not pre-approved',
        message: 'Sorry, you are not allowed to register. Your details do not match our pre-approved student list. Please contact the event organizers if you believe this is an error.' 
      });
    }
    
    console.log('✅ Registration ALLOWED - Student found in allowlist');
    
    // Generate unique event ID (serves as roll number)
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


