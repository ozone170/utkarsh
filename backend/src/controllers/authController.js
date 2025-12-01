import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await AdminUser.findOne({ email }).populate('assignedHalls');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const responseData = { 
      token, 
      role: admin.role, 
      name: admin.name 
    };

    // If volunteer, include assigned hall info
    if (admin.role === 'VOLUNTEER' && admin.assignedHalls && admin.assignedHalls.length > 0) {
      responseData.assignedHall = admin.assignedHalls[0];
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
