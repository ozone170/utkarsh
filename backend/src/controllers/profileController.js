import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import AdminUser from '../models/AdminUser.js';
import { logAudit } from '../../services/auditLogger.js';

/**
 * Get current user's profile
 */
export const getProfile = async (req, res) => {
  try {
    let user;
    
    // Check if it's a regular user or admin user
    if (req.user.role) {
      // Admin user
      user = await AdminUser.findById(req.user.id)
        .populate('assignedHalls', 'name code')
        .select('-passwordHash');
    } else {
      // Regular user
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, program, year } = req.body;
    
    let user;
    const updateData = {};

    // Build update object
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (program) updateData.program = program;
    if (year) updateData.year = year;

    // Validate program-year combination
    if (program && year) {
      const allowedYears = program.toLowerCase() === 'mba' ? [1, 2] : [1, 2, 3, 4];
      if (!allowedYears.includes(year)) {
        return res.status(400).json({
          message: `Invalid year for ${program}. Allowed years: ${allowedYears.join(', ')}`
        });
      }
    }

    // Check if it's a regular user or admin user
    if (req.user.role) {
      // Admin user - only allow name and email updates
      const adminUpdateData = {};
      if (name) adminUpdateData.name = name;
      if (email) adminUpdateData.email = email;
      
      user = await AdminUser.findByIdAndUpdate(
        req.user.id,
        adminUpdateData,
        { new: true, runValidators: true }
      ).populate('assignedHalls', 'name code').select('-passwordHash');
    } else {
      // Regular user
      user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the update
    await logAudit({
      actorId: req.user.id,
      actorName: user.name,
      actorRole: req.user.role || 'USER',
      action: 'PROFILE_UPDATE',
      resource: 'Profile',
      resourceId: req.user.id,
      details: { updatedFields: Object.keys(updateData) }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists` 
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Change user password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    let user;
    
    // Check if it's a regular user or admin user
    if (req.user.role) {
      user = await AdminUser.findById(req.user.id);
    } else {
      return res.status(400).json({ 
        message: 'Password change not available for regular users' 
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await AdminUser.findByIdAndUpdate(req.user.id, {
      passwordHash: newPasswordHash
    });

    // Log the password change
    await logAudit({
      actorId: req.user.id,
      actorName: user.name,
      actorRole: 'ADMIN',
      action: 'PASSWORD_CHANGE',
      resource: 'Profile',
      resourceId: req.user.id,
      details: { timestamp: new Date() }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



/**
 * Download ID card
 */
export const downloadIdCard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let user;
    if (req.user.role) {
      user = await AdminUser.findById(userId)
        .populate('assignedHalls', 'name code');
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow students (regular users without admin roles) to download ID cards
    if (req.user.role) {
      return res.status(403).json({ message: 'ID card download is only available for students' });
    }

    try {
      // Generate ID card image
      const { generateIdCardImage } = await import('../services/idCardImageGenerator.js');
      const imageBuffer = await generateIdCardImage(user);
      
      // Set response headers for image
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${user.name}_ID_Card.jpg"`);
      
      res.send(imageBuffer);
    } catch (imageError) {
      console.error('Image generation error:', imageError);
      return res.status(500).json({ 
        message: 'ID card generation is currently unavailable. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Error generating ID card:', error);
    res.status(500).json({ message: 'Failed to generate ID card' });
  }
};

