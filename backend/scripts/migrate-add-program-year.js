/**
 * Migration script to add program and year fields to existing users
 * Run this script after updating the User model to include program field
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

async function migrateUsers() {
  try {
    console.log('🔄 Starting migration: Add program and year fields to existing users');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find users missing program field
    const usersWithoutProgram = await User.find({ program: { $exists: false } });
    console.log(`📊 Found ${usersWithoutProgram.length} users without program field`);

    // Update users missing program to 'MBA' (default for existing users)
    if (usersWithoutProgram.length > 0) {
      const result1 = await User.updateMany(
        { program: { $exists: false } }, 
        { $set: { program: 'MBA' } }
      );
      console.log(`✅ Updated ${result1.modifiedCount} users with program: MBA`);
    }

    // Find users missing year field
    const usersWithoutYear = await User.find({ year: { $exists: false } });
    console.log(`📊 Found ${usersWithoutYear.length} users without year field`);

    // Update users missing year to 1 (default for existing users)
    if (usersWithoutYear.length > 0) {
      const result2 = await User.updateMany(
        { year: { $exists: false } }, 
        { $set: { year: 1 } }
      );
      console.log(`✅ Updated ${result2.modifiedCount} users with year: 1`);
    }

    // Handle users with 'branch' field (old schema) - migrate to 'program'
    const usersWithBranch = await User.find({ branch: { $exists: true } });
    console.log(`📊 Found ${usersWithBranch.length} users with old 'branch' field`);

    if (usersWithBranch.length > 0) {
      for (const user of usersWithBranch) {
        // Copy branch value to program field if program doesn't exist
        if (!user.program) {
          await User.updateOne(
            { _id: user._id },
            { 
              $set: { program: user.branch || 'MBA' },
              $unset: { branch: 1 } // Remove old branch field
            }
          );
        } else {
          // Just remove branch field if program already exists
          await User.updateOne(
            { _id: user._id },
            { $unset: { branch: 1 } }
          );
        }
      }
      console.log(`✅ Migrated ${usersWithBranch.length} users from 'branch' to 'program' field`);
    }

    // Verify migration results
    const totalUsers = await User.countDocuments();
    const usersWithProgram = await User.countDocuments({ program: { $exists: true } });
    const usersWithYear = await User.countDocuments({ year: { $exists: true } });
    const usersWithBranchRemaining = await User.countDocuments({ branch: { $exists: true } });

    console.log('\n📊 Migration Summary:');
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with program: ${usersWithProgram}`);
    console.log(`   Users with year: ${usersWithYear}`);
    console.log(`   Users with old branch field: ${usersWithBranchRemaining}`);

    if (usersWithProgram === totalUsers && usersWithYear === totalUsers && usersWithBranchRemaining === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️  Migration may be incomplete. Please check the data.');
    }

    // Show sample of migrated data
    const sampleUsers = await User.find().limit(3).select('name program year branch');
    console.log('\n📋 Sample migrated users:');
    sampleUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} - Program: ${user.program}, Year: ${user.year}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsers();
}

export default migrateUsers;