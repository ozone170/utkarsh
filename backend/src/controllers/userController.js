import User from '../models/User.js';
import crypto from 'crypto';
import { isAllowed } from '../../services/allowedList.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, gender, section } = req.body;
    const year = 1; // All students are first year for UTKARSH 2025
    const branch = 'MBA'; // All students are MBA
    
    // Validate required fields
    if (!name || !email || !phone || !gender || !section) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender value' });
    }

    // Validate section
    if (!['A', 'B', 'C', 'D'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section value' });
    }

    // Check if phone number is in the allowlist
    console.log('🔐 Validating student registration for phone:', phone);
    
    if (!isAllowed(phone)) {
      console.log('❌ Registration BLOCKED - Phone number not in allowlist');
      return res.status(403).json({ 
        error: 'Not authorized',
        message: 'Sorry, this phone number is not authorized to register. Please contact the event organizers if you believe this is an error.' 
      });
    }
    
    console.log('✅ Registration ALLOWED - Phone number found in allowlist');
    
    // Check if phone number already registered
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      console.log('❌ Registration BLOCKED - Phone number already registered');
      return res.status(400).json({ 
        error: 'Already registered',
        message: 'This phone number has already been used to register. Multiple registrations are not allowed.' 
      });
    }
    
    // Generate unique event ID (serves as roll number)
    const eventId = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    const user = await User.create({
      name,
      email,
      phone,
      branch,
      year,
      gender,
      section,
      eventId
    });

    res.status(201).json({ user, eventId });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors
      if (error.keyPattern?.email) {
        return res.status(400).json({ 
          error: 'Email already registered',
          message: 'This email has already been used to register.' 
        });
      }
      if (error.keyPattern?.phone) {
        return res.status(400).json({ 
          error: 'Phone already registered',
          message: 'This phone number has already been used to register.' 
        });
      }
      return res.status(400).json({ message: 'Registration already exists' });
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


