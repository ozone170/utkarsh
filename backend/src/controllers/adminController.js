import bcrypt from 'bcryptjs';
import fs from 'fs';
import crypto from 'crypto';
import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';
import AdminUser from '../models/AdminUser.js';
import AuditLog from '../../models/AuditLog.js';
import { logAudit } from '../../services/auditLogger.js';
import { parseUploadedFile, processBulkUpload, generateCSVTemplate } from '../services/fileParser.js';

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
    const { name, email, phone, gender, section, program, year } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !gender || !section || !program || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Import validation utilities
    const { validateProgramYear, getValidPrograms } = await import('../utils/programValidation.js');
    
    // Validate program
    const validPrograms = getValidPrograms();
    if (!validPrograms.includes(program)) {
      return res.status(400).json({ 
        message: `Invalid program. Valid programs: ${validPrograms.join(', ')}` 
      });
    }

    // Validate program-year combination
    const programYearError = validateProgramYear(program, year);
    if (programYearError) {
      return res.status(400).json({ message: programYearError });
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
      program,
      year: Number(year),
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
    const { name, email, phone, program, year, gender, section } = req.body;
    
    // Import validation utilities
    const { validateProgramYear, getValidPrograms } = await import('../utils/programValidation.js');
    
    // Validate program if provided
    if (program) {
      const validPrograms = getValidPrograms();
      if (!validPrograms.includes(program)) {
        return res.status(400).json({ 
          message: `Invalid program. Valid programs: ${validPrograms.join(', ')}` 
        });
      }
    }

    // Validate program-year combination if both provided
    if (program && year) {
      const programYearError = validateProgramYear(program, year);
      if (programYearError) {
        return res.status(400).json({ message: programYearError });
      }
    }
    
    const updateData = { name, email, phone };
    if (program) updateData.program = program;
    if (year) updateData.year = Number(year);
    if (gender) updateData.gender = gender;
    if (section) updateData.section = section;
    
    const student = await User.findByIdAndUpdate(
      studentId,
      updateData,
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

export const bulkUploadStudents = async (req, res) => {
  try {
    const { defaultProgram = 'MBA', forceApply = false } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the uploaded file
    let records;
    try {
      records = parseUploadedFile(file.path, file.originalname);
    } catch (parseError) {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        message: 'File parsing failed', 
        error: parseError.message 
      });
    }

    if (records.length === 0) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'File contains no data rows' });
    }

    // Process and validate records
    const processResults = processBulkUpload(records, defaultProgram);

    // Check for existing users in database
    const validRecords = processResults.valid;
    const existingEmails = [];
    const existingPhones = [];

    if (validRecords.length > 0) {
      const emails = validRecords.map(r => r.data.email);
      const phones = validRecords.map(r => r.data.phone);

      const existingUsers = await User.find({
        $or: [
          { email: { $in: emails } },
          { phone: { $in: phones } }
        ]
      });

      existingUsers.forEach(user => {
        const emailMatch = validRecords.find(r => r.data.email === user.email);
        const phoneMatch = validRecords.find(r => r.data.phone === user.phone);

        if (emailMatch) {
          existingEmails.push({
            ...emailMatch,
            errors: [...emailMatch.errors, 'Email already exists in database'],
            existingUser: { name: user.name, email: user.email }
          });
        }

        if (phoneMatch && phoneMatch !== emailMatch) {
          existingPhones.push({
            ...phoneMatch,
            errors: [...phoneMatch.errors, 'Phone already exists in database'],
            existingUser: { name: user.name, phone: user.phone }
          });
        }
      });

      // Remove existing users from valid records unless forceApply is true
      if (!forceApply) {
        const existingEmailSet = new Set(existingEmails.map(e => e.data.email));
        const existingPhoneSet = new Set(existingPhones.map(p => p.data.phone));
        
        processResults.valid = validRecords.filter(record => 
          !existingEmailSet.has(record.data.email) && 
          !existingPhoneSet.has(record.data.phone)
        );
      }
    }

    // Prepare response
    const response = {
      file: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype
      },
      processing: {
        totalRows: processResults.total,
        validRows: processResults.valid.length,
        invalidRows: processResults.invalid.length,
        duplicateEmails: processResults.duplicateEmails.length,
        duplicatePhones: processResults.duplicatePhones.length,
        existingEmails: existingEmails.length,
        existingPhones: existingPhones.length
      },
      preview: {
        valid: processResults.valid.slice(0, 5), // Show first 5 valid records
        invalid: processResults.invalid.slice(0, 10), // Show first 10 invalid records
        existingEmails: existingEmails.slice(0, 5),
        existingPhones: existingPhones.slice(0, 5)
      },
      canApply: processResults.valid.length > 0,
      forceApply: Boolean(forceApply)
    };

    // If forceApply is true, actually create the users
    if (forceApply && processResults.valid.length > 0) {
      const createdUsers = [];
      const failedUsers = [];

      for (const record of processResults.valid) {
        try {
          // Generate unique event ID
          const eventId = crypto.randomBytes(8).toString('hex').toUpperCase();
          
          const user = await User.create({
            ...record.data,
            eventId
          });

          createdUsers.push({
            ...record,
            user,
            eventId
          });
        } catch (createError) {
          failedUsers.push({
            ...record,
            error: createError.message
          });
        }
      }

      // Log audit
      await logAudit({
        actorId: req.user.id,
        actorName: req.user.name || 'Admin',
        actorRole: req.user.role,
        action: 'BULK_UPLOAD_STUDENTS',
        resource: 'User',
        details: {
          fileName: file.originalname,
          totalRows: processResults.total,
          createdCount: createdUsers.length,
          failedCount: failedUsers.length,
          forceApply: true
        },
        ipAddress: req.ip
      });

      response.applied = {
        created: createdUsers.length,
        failed: failedUsers.length,
        createdUsers: createdUsers.slice(0, 5), // Show first 5 created
        failedUsers
      };
    }

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    res.json(response);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const downloadTemplate = async (req, res) => {
  try {
    const csvTemplate = generateCSVTemplate();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=student-upload-template.csv');
    res.send(csvTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all users (both regular users and admin users) for certificate management
 */
export const getAllUsers = async (req, res) => {
  try {
    // Get regular users
    const regularUsers = await User.find({})
      .select('name email phone program year eventId profilePhoto')
      .lean();

    // Get admin users
    const adminUsers = await AdminUser.find({})
      .populate('assignedHalls', 'name code')
      .select('name email role assignedHalls profilePhoto')
      .lean();

    // Combine and format users
    const allUsers = [
      ...regularUsers.map(user => ({
        ...user,
        role: 'PARTICIPANT',
        type: 'user'
      })),
      ...adminUsers.map(user => ({
        ...user,
        type: 'admin'
      }))
    ];

    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user activity (hall movements + food logs) with pagination
 */
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      start, 
      end, 
      page = 1, 
      limit = 50,
      type = 'all' // 'all', 'hall', 'food'
    } = req.query;

    // Validate ObjectId format
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // TASK 1: Detect user type and handle differently
    let user = await User.findById(userId);
    let isVolunteer = false;
    let assignedHall = null;
    
    if (!user) {
      // Check if it's a volunteer/admin user
      user = await AdminUser.findById(userId).populate('assignedHalls', 'name code');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      isVolunteer = user.role === 'VOLUNTEER';
      assignedHall = user.assignedHalls && user.assignedHalls.length > 0 ? user.assignedHalls[0] : null;
    }

    // TASK 1: Separate logic for volunteers vs students
    if (isVolunteer) {
      return await getVolunteerActivity(req, res, user, assignedHall);
    } else {
      return await getStudentActivity(req, res, user);
    }

  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * TASK 1: Get volunteer activity - shows scanning actions performed by volunteer
 */
const getVolunteerActivity = async (req, res, user, assignedHall) => {
  const { start, end, page = 1, limit = 50, type = 'all' } = req.query;
  
  // Build date filter for audit logs
  const dateFilter = {};
  if (start) {
    dateFilter.$gte = new Date(start);
  }
  if (end) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    dateFilter.$lte = endDate;
  }

  // TASK 1 FIX 2: Get volunteer's scanning activity from AuditLog
  const auditQuery = {
    actorId: user._id,
    action: {
      $in: [
        'SCAN_HALL_ENTRY',
        'SCAN_HALL_EXIT', 
        'SCAN_HALL_MOVEMENT',
        'SCAN_FOOD_ALLOWED',
        'SCAN_FOOD_DENIED',
        'VOLUNTEER_ASSIGN_HALL', // TASK 2: Include hall assignment changes
        'VOLUNTEER_UNASSIGN_HALL'
      ]
    }
  };

  if (Object.keys(dateFilter).length > 0) {
    auditQuery.timestamp = dateFilter;
  }

  const auditLogs = await AuditLog.find(auditQuery)
    .sort({ timestamp: -1 })
    .lean();

  // Transform audit logs into activity format
  let activities = [];
  
  for (const log of auditLogs) {
    let activityType = '';
    let description = '';
    
    switch (log.action) {
      case 'SCAN_HALL_ENTRY':
        activityType = 'scan-hall-entry';
        description = `Scanned student entry: ${log.details.studentName || 'Unknown'}`;
        break;
      case 'SCAN_HALL_EXIT':
        activityType = 'scan-hall-exit';
        description = `Scanned student exit: ${log.details.studentName || 'Unknown'}`;
        break;
      case 'SCAN_HALL_MOVEMENT':
        activityType = 'scan-hall-movement';
        description = `Scanned student movement: ${log.details.studentName || 'Unknown'}`;
        break;
      case 'SCAN_FOOD_ALLOWED':
        activityType = 'scan-food-allowed';
        description = `Approved food claim: ${log.details.studentName || 'Unknown'}`;
        break;
      case 'SCAN_FOOD_DENIED':
        activityType = 'scan-food-denied';
        description = `Denied food claim: ${log.details.studentName || 'Unknown'}`;
        break;
      case 'VOLUNTEER_ASSIGN_HALL':
        activityType = 'hall-assignment';
        description = `Assigned to hall: ${log.details.newHalls || 'Unknown'}`;
        break;
      case 'VOLUNTEER_UNASSIGN_HALL':
        activityType = 'hall-unassignment';
        description = `Unassigned from hall: ${log.details.previousHalls || 'Unknown'}`;
        break;
      default:
        continue; // Skip unknown actions
    }

    activities.push({
      type: activityType,
      time: log.timestamp,
      description: description,
      studentName: log.details.studentName || null,
      studentEventId: log.details.studentEventId || null,
      hallName: log.details.hallName || null,
      hallCode: log.details.hallCode || null,
      logId: log._id,
      details: log.details
    });
  }

  // Filter by type if specified
  if (type !== 'all') {
    if (type === 'hall') {
      activities = activities.filter(a => 
        a.type.includes('hall') || a.type.includes('scan-hall')
      );
    } else if (type === 'food') {
      activities = activities.filter(a => 
        a.type.includes('food') || a.type.includes('scan-food')
      );
    }
  }

  // Implement pagination
  const total = activities.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedActivities = activities.slice(startIndex, endIndex);

  // Log audit for activity access
  await logAudit({
    actorId: req.user.id,
    actorName: req.user.name || 'Admin',
    actorRole: req.user.role,
    action: 'VIEW_USER_ACTIVITY',
    resource: 'AdminUser',
    resourceId: user._id,
    details: {
      targetUserName: user.name,
      targetUserEmail: user.email,
      activityType: type,
      dateRange: { start, end },
      page: parseInt(page),
      limit: parseInt(limit),
      userType: 'VOLUNTEER'
    },
    ipAddress: req.ip
  });

  // TASK 3: Remove currentLocation for volunteers
  res.json({
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    eventId: null, // Volunteers don't have event IDs
    assignedHalls: user.assignedHalls || null,
    assignedHall: assignedHall,
    currentLocation: null, // TASK 3: Volunteers don't have current location
    activities: paginatedActivities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: endIndex < total,
      hasPrev: page > 1
    }
  });
};

/**
 * Get student activity - shows student's own movements and food claims
 */
const getStudentActivity = async (req, res, user) => {
  const { start, end, page = 1, limit = 50, type = 'all' } = req.query;
  
  // Build date filter
  const dateFilter = {};
  if (start) {
    dateFilter.$gte = new Date(start);
  }
  if (end) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    dateFilter.$lte = endDate;
  }

  // TASK A1: Get current location (open hall log)
  const currentLocation = await HallLog.findOne({ 
    userId: user._id, 
    $or: [
      { exitTime: null },
      { exitTime: { $exists: false } },
      { exitTime: "" }
    ]
  }).populate('hallId', 'name code');

  // TASK A1: Get current or last hall for better UX
  let currentOrLastHall = null;
  
  if (currentLocation) {
    // Student is currently in a hall
    currentOrLastHall = {
      type: "current",
      hallName: currentLocation.hallId.name,
      hallCode: currentLocation.hallId.code,
      at: currentLocation.entryTime
    };
  } else {
    // Check for last hall visited
    const lastLog = await HallLog.find({ userId: user._id })
      .sort({ exitTime: -1, entryTime: -1 })
      .limit(1)
      .populate('hallId', 'name code');
    
    if (lastLog.length > 0) {
      currentOrLastHall = {
        type: "last",
        hallName: lastLog[0].hallId.name,
        hallCode: lastLog[0].hallId.code,
        at: lastLog[0].exitTime || lastLog[0].entryTime
      };
    }
  }

  let activities = [];

  // Get hall logs if requested
  if (type === 'all' || type === 'hall') {
    const hallQuery = { userId: user._id };
    if (Object.keys(dateFilter).length > 0) {
      hallQuery.entryTime = dateFilter;
    }

    const hallLogs = await HallLog.find(hallQuery)
      .populate('hallId', 'name code')
      .sort({ entryTime: -1 })
      .lean();

    // Convert hall logs to activity events
    for (const log of hallLogs) {
      if (log.entryTime && log.hallId) {
        activities.push({
          type: 'hall-entry',
          time: log.entryTime,
          hallId: log.hallId._id,
          hallName: log.hallId.name,
          hallCode: log.hallId.code,
          logId: log._id,
          details: {
            date: log.date,
            dayIndex: log.dayIndex
          }
        });
      }

      if (log.exitTime && log.hallId) {
        activities.push({
          type: 'hall-exit',
          time: log.exitTime,
          hallId: log.hallId._id,
          hallName: log.hallId.name,
          hallCode: log.hallId.code,
          logId: log._id,
          details: {
            date: log.date,
            dayIndex: log.dayIndex
          }
        });
      }
    }
  }

  // Get food logs if requested
  if (type === 'all' || type === 'food') {
    const foodQuery = { userId: user._id };
    if (Object.keys(dateFilter).length > 0) {
      foodQuery.time = dateFilter;
    }

    const foodLogs = await FoodLog.find(foodQuery)
      .sort({ time: -1 })
      .lean();

    for (const log of foodLogs) {
      if (log.time) {
        activities.push({
          type: 'food-claim',
          time: log.time,
          logId: log._id,
          details: {
            date: log.date
          }
        });
      }
    }
  }

  // Sort all activities by time (newest first)
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Get scanner information from audit logs
  const auditLogs = await AuditLog.find({
    resourceId: user._id,
    action: { 
      $in: [
        'SCAN_HALL_ENTRY', 
        'SCAN_HALL_EXIT', 
        'SCAN_HALL_MOVEMENT', 
        'SCAN_FOOD_ALLOWED',
        'SCAN_FOOD_DENIED'
      ]
    }
  }).sort({ timestamp: -1 }).limit(200).lean();

  // Enhance activities with scanner information
  const auditMap = new Map();
  auditLogs.forEach(audit => {
    const timeKey = new Date(audit.timestamp).getTime();
    auditMap.set(timeKey, audit);
  });

  activities.forEach(activity => {
    const activityTime = new Date(activity.time).getTime();
    for (let i = -5000; i <= 5000; i += 1000) {
      const audit = auditMap.get(activityTime + i);
      if (audit) {
        activity.scanner = audit.actorName;
        activity.scannerRole = audit.actorRole;
        activity.ipAddress = audit.ipAddress;
        break;
      }
    }
  });

  // Implement pagination
  const total = activities.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedActivities = activities.slice(startIndex, endIndex);

  // Log audit for activity access
  await logAudit({
    actorId: req.user.id,
    actorName: req.user.name || 'Admin',
    actorRole: req.user.role,
    action: 'VIEW_USER_ACTIVITY',
    resource: 'User',
    resourceId: user._id,
    details: {
      targetUserName: user.name,
      targetUserEmail: user.email,
      activityType: type,
      dateRange: { start, end },
      page: parseInt(page),
      limit: parseInt(limit),
      userType: 'STUDENT'
    },
    ipAddress: req.ip
  });

  res.json({
    userId: user._id,
    name: user.name,
    email: user.email,
    role: 'PARTICIPANT',
    eventId: user.eventId || null,
    assignedHalls: null,
    assignedHall: null,
    currentOrLastHall: currentOrLastHall, // TASK A1: Add current or last hall info
    currentLocation: currentLocation ? {
      hallId: currentLocation.hallId._id,
      hallName: currentLocation.hallId.name,
      hallCode: currentLocation.hallId.code,
      entryTime: currentLocation.entryTime,
      openLogId: currentLocation._id
    } : null,
    activities: paginatedActivities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: endIndex < total,
      hasPrev: page > 1
    }
  });
};

/**
 * Get user activity optimized for timeline view
 */
export const getUserActivityTimeline = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Create a new request object for getUserActivity with high limit
    const activityReq = {
      ...req,
      query: { ...req.query, page: 1, limit: 1000 }
    };
    
    // Create a mock response object to capture the data
    let activityData;
    const mockRes = {
      json: (data) => { activityData = data; },
      status: () => mockRes
    };

    // Call getUserActivity to get the data
    await getUserActivity(activityReq, mockRes);

    if (!activityData) {
      return res.status(500).json({ message: 'Failed to fetch activity data' });
    }

    // Group activities by date
    const timelineData = {};
    
    activityData.activities.forEach(activity => {
      const date = new Date(activity.time).toISOString().split('T')[0];
      if (!timelineData[date]) {
        timelineData[date] = [];
      }
      timelineData[date].push(activity);
    });

    // Sort dates descending and activities within each date
    const sortedTimeline = Object.keys(timelineData)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        activities: timelineData[date].sort((a, b) => new Date(b.time) - new Date(a.time))
      }));

    res.json({
      userId: activityData.userId,
      name: activityData.name,
      email: activityData.email,
      role: activityData.role,
      currentLocation: activityData.currentLocation,
      timeline: sortedTimeline
    });
  } catch (error) {
    console.error('Error fetching user activity timeline:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Assign or update volunteer's assigned hall
 */
export const assignVolunteerHall = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { hallId } = req.body;

    // Validate volunteer exists
    const volunteer = await AdminUser.findById(volunteerId);
    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Store previous assignment for audit - get hall names
    const previousHalls = volunteer.assignedHalls || [];
    let previousHallNames = [];
    if (previousHalls.length > 0) {
      const prevHalls = await Hall.find({ _id: { $in: previousHalls } });
      previousHallNames = prevHalls.map(h => h.name);
    }

    let updateData;
    let newHallName = null;
    if (hallId) {
      // Validate hall exists and is active
      const hall = await Hall.findById(hallId);
      if (!hall || !hall.isActive) {
        return res.status(400).json({ message: 'Invalid or inactive hall' });
      }
      updateData = { assignedHalls: [hallId] };
      newHallName = hall.name;
    } else {
      // Unassign (clear assigned halls)
      updateData = { assignedHalls: [] };
    }

    // Update volunteer
    const updatedVolunteer = await AdminUser.findByIdAndUpdate(
      volunteerId,
      updateData,
      { new: true }
    ).populate('assignedHalls', 'name code');

    // TASK 2: Enhanced audit logging for hall assignment changes
    await logAudit({
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      actorRole: req.user.role,
      action: hallId ? 'VOLUNTEER_ASSIGN_HALL' : 'VOLUNTEER_UNASSIGN_HALL',
      resource: 'AdminUser',
      resourceId: volunteerId,
      details: {
        volunteerName: volunteer.name,
        volunteerEmail: volunteer.email,
        previousHalls: previousHallNames.join(', ') || 'None',
        newHalls: newHallName || 'None',
        previousHallIds: previousHalls.map(h => h.toString()),
        newHallIds: updateData.assignedHalls,
        hallId: hallId || null,
        adminName: req.user.name || 'Admin'
      },
      ipAddress: req.ip
    });

    res.json({
      message: hallId ? 'Volunteer assigned successfully' : 'Volunteer unassigned successfully',
      volunteer: updatedVolunteer
    });
  } catch (error) {
    console.error('Error assigning volunteer hall:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get volunteer details including assigned halls
 */
export const getVolunteerDetails = async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const volunteer = await AdminUser.findById(volunteerId)
      .populate('assignedHalls', 'name code isActive')
      .select('-passwordHash');

    if (!volunteer || volunteer.role !== 'VOLUNTEER') {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Export user activity as CSV
 */
export const exportUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { start, end, type = 'all' } = req.query;

    // Validate user exists
    let user = await User.findById(userId);
    let isVolunteer = false;
    
    if (!user) {
      user = await AdminUser.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      isVolunteer = true;
    }

    // Build date filter
    const dateFilter = {};
    if (start) {
      dateFilter.$gte = new Date(start);
    }
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = endDate;
    }

    let activities = [];

    // Get hall logs if requested
    if (type === 'all' || type === 'hall') {
      const hallQuery = { userId };
      if (Object.keys(dateFilter).length > 0) {
        hallQuery.entryTime = dateFilter;
      }

      const hallLogs = await HallLog.find(hallQuery)
        .populate('hallId', 'name code')
        .sort({ entryTime: -1 })
        .lean();

      // Convert hall logs to activity events
      for (const log of hallLogs) {
        activities.push({
          type: 'hall-entry',
          time: log.entryTime,
          hallName: log.hallId.name,
          hallCode: log.hallId.code,
          action: `Entered ${log.hallId.name}`,
          logId: log._id
        });

        if (log.exitTime) {
          activities.push({
            type: 'hall-exit',
            time: log.exitTime,
            hallName: log.hallId.name,
            hallCode: log.hallId.code,
            action: `Exited ${log.hallId.name}`,
            logId: log._id
          });
        }
      }
    }

    // Get food logs if requested
    if (type === 'all' || type === 'food') {
      const foodQuery = { userId };
      if (Object.keys(dateFilter).length > 0) {
        foodQuery.time = dateFilter;
      }

      const foodLogs = await FoodLog.find(foodQuery)
        .sort({ time: -1 })
        .lean();

      for (const log of foodLogs) {
        activities.push({
          type: 'food-claim',
          time: log.time,
          action: 'Food claimed',
          hallName: 'N/A',
          hallCode: 'N/A',
          logId: log._id
        });
      }
    }

    // Sort activities by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Create CSV content
    const headers = ['Date', 'Time', 'Type', 'Action', 'Hall', 'Hall Code'];
    const rows = activities.map(activity => {
      const date = new Date(activity.time);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        activity.type.replace('-', ' ').toUpperCase(),
        activity.action,
        activity.hallName || 'N/A',
        activity.hallCode || 'N/A'
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Log audit
    await logAudit({
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      actorRole: req.user.role,
      action: 'VIEW_USER_ACTIVITY',
      resource: isVolunteer ? 'AdminUser' : 'User',
      resourceId: userId,
      details: {
        targetUserName: user.name,
        exportType: 'CSV',
        activityType: type,
        dateRange: { start, end },
        recordCount: activities.length
      },
      ipAddress: req.ip
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s+/g, '_')}_activity.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting user activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

