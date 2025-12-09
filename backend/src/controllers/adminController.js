import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';
import AdminUser from '../models/AdminUser.js';
import { logAudit } from '../../services/auditLogger.js';

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

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, gender, section } = req.body;
    const year = 1;
    const branch = 'MBA';
    
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

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ 
        message: 'Phone number already registered' 
      });
    }
    
    // Generate unique event ID (16-char hex)
    const crypto = await import('crypto');
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

    // Log audit
    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        actorName: req.user.name || 'Admin',
        actorRole: req.user.role,
        action: 'STUDENT_CREATE',
        resource: 'User',
        resourceId: user._id,
        details: {
          studentName: name,
          studentEmail: email,
          studentPhone: phone,
          studentEventId: eventId,
          createdBy: 'ADMIN'
        },
        ipAddress: req.ip
      });
    }

    res.status(201).json({ user, eventId });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }
      if (error.keyPattern?.phone) {
        return res.status(400).json({ 
          message: 'Phone number already registered' 
        });
      }
      return res.status(400).json({ message: 'Student already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getFoodClaims = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : { date: new Date().toISOString().split('T')[0] };
    
    const claims = await FoodLog.find(query)
      .populate('userId', 'name email eventId branch year')
      .sort({ time: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, phone } = req.body;
    const year = 1; // All students are first year
    const branch = 'MBA'; // All students are MBA
    
    const student = await User.findByIdAndUpdate(
      studentId,
      { name, email, phone, branch, year },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await User.findByIdAndDelete(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also delete related logs
    await HallLog.deleteMany({ userId: studentId });
    await FoodLog.deleteMany({ userId: studentId });

    // Log audit
    await logAudit({
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      actorRole: req.user.role,
      action: 'STUDENT_DELETE',
      resource: 'User',
      resourceId: studentId,
      details: {
        studentName: student.name,
        studentEmail: student.email,
        studentEventId: student.eventId
      },
      ipAddress: req.ip
    });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportStudents = async (req, res) => {
  try {
    const students = await User.find().sort({ createdAt: -1 });
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Branch', 'Event ID', 'Created At'];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.phone,
      s.branch,
      s.eventId,
      new Date(s.createdAt).toLocaleString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportFoodLogs = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};
    
    const logs = await FoodLog.find(query)
      .populate('userId', 'name email eventId branch year phone rollNo')
      .sort({ time: -1 });
    
    // Create CSV content
    const headers = ['Student Name', 'Email', 'Phone', 'Branch', 'Event ID', 'Date', 'Time'];
    const rows = logs.map(log => [
      log.userId.name,
      log.userId.email,
      log.userId.phone,
      log.userId.branch,
      log.userId.eventId,
      log.date,
      new Date(log.time).toLocaleString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=food-logs-${date || 'all'}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
