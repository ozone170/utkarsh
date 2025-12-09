import User from '../models/User.js';
import Hall from '../models/Hall.js';
import HallLog from '../models/HallLog.js';
import FoodLog from '../models/FoodLog.js';
import { logAudit } from '../../services/auditLogger.js';

export const scanHall = async (req, res) => {
  try {
    const { eventId, hallCode } = req.body;
    
    const user = await User.findOne({ eventId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hall = await Hall.findOne({ code: hallCode, isActive: true });
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found or inactive' });
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

    const openLog = await HallLog.findOne({ userId: user._id, exitTime: null });

    let action, status, message, responseData;

    if (!openLog) {
      await HallLog.create({
        userId: user._id,
        hallId: hall._id,
        entryTime: now,
        date,
        dayIndex
      });
      action = 'SCAN_HALL_ENTRY';
      status = 'entry';
      message = `Entered ${hall.name}`;
      responseData = { status, message, hall: hall.name };
    } else if (openLog.hallId.toString() === hall._id.toString()) {
      openLog.exitTime = now;
      await openLog.save();
      action = 'SCAN_HALL_EXIT';
      status = 'exit';
      message = `Exited ${hall.name}`;
      responseData = { status, message, hall: hall.name };
    } else {
      const previousHall = await Hall.findById(openLog.hallId);
      openLog.exitTime = now;
      await openLog.save();

      await HallLog.create({
        userId: user._id,
        hallId: hall._id,
        entryTime: now,
        date,
        dayIndex
      });

      action = 'SCAN_HALL_MOVEMENT';
      status = 'movement';
      message = `Moved from ${previousHall.name} to ${hall.name}`;
      responseData = { status, message, from: previousHall.name, to: hall.name };
    }

    // Log audit
    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        actorName: req.user.name || 'Scanner',
        actorRole: req.user.role,
        action,
        resource: 'HallLog',
        resourceId: user._id,
        details: {
          studentName: user.name,
          studentEventId: eventId,
          hallName: hall.name,
          hallCode: hallCode,
          timestamp: now
        },
        ipAddress: req.ip
      });
    }

    return res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scanFood = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    const user = await User.findOne({ eventId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const date = new Date().toISOString().split('T')[0];
    
    const existing = await FoodLog.findOne({ userId: user._id, date });
    
    let action, status, message;
    
    if (existing) {
      action = 'SCAN_FOOD_DENIED';
      status = 'denied';
      message = 'Food already claimed today';
      
      // Log audit
      if (req.user) {
        await logAudit({
          actorId: req.user.id,
          actorName: req.user.name || 'Scanner',
          actorRole: req.user.role,
          action,
          resource: 'FoodLog',
          resourceId: user._id,
          details: {
            studentName: user.name,
            studentEventId: eventId,
            reason: 'Already claimed today',
            date,
            claimedAt: existing.time
          },
          ipAddress: req.ip
        });
      }
      
      // Return 200 with denied status and claim details for frontend to show result page
      return res.json({ 
        status, 
        message,
        claimedAt: existing.time,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          branch: user.branch,
          year: user.year,
          eventId: user.eventId
        }
      });
    }

    await FoodLog.create({ userId: user._id, date });
    action = 'SCAN_FOOD_ALLOWED';
    status = 'allowed';
    message = 'Food claim successful';

    // Log audit
    if (req.user) {
      await logAudit({
        actorId: req.user.id,
        actorName: req.user.name || 'Scanner',
        actorRole: req.user.role,
        action,
        resource: 'FoodLog',
        resourceId: user._id,
        details: {
          studentName: user.name,
          studentEventId: eventId,
          date
        },
        ipAddress: req.ip
      });
    }

    res.json({ 
      status, 
      message,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        branch: user.branch,
        year: user.year,
        eventId: user.eventId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
