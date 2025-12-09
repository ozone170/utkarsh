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
