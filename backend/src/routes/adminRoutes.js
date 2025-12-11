import express from 'express';
import multer from 'multer';
import { getOverviewStats, getHallOccupancy, createVolunteer, getVolunteers, updateVolunteer, deleteVolunteer, getAllStudents, createStudent, updateStudent, deleteStudent, getFoodClaims, exportStudents, exportFoodLogs, bulkUploadStudents, downloadTemplate, getAllUsers } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

// Configure multer for file uploads
const upload = multer({ 
  dest: '/tmp',
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'));
    }
  }
});

const router = express.Router();

router.get('/stats/overview', authMiddleware, roleMiddleware('ADMIN'), getOverviewStats);
router.get('/hall-occupancy', authMiddleware, roleMiddleware('ADMIN'), getHallOccupancy);
router.post('/volunteers', authMiddleware, roleMiddleware('ADMIN'), createVolunteer);
router.get('/volunteers', authMiddleware, roleMiddleware('ADMIN'), getVolunteers);
router.put('/volunteers/:volunteerId', authMiddleware, roleMiddleware('ADMIN'), updateVolunteer);
router.delete('/volunteers/:volunteerId', authMiddleware, roleMiddleware('ADMIN'), deleteVolunteer);
router.get('/students', authMiddleware, roleMiddleware('ADMIN'), getAllStudents);
router.post('/students', authMiddleware, roleMiddleware('ADMIN'), createStudent);
router.put('/students/:studentId', authMiddleware, roleMiddleware('ADMIN'), updateStudent);
router.delete('/students/:studentId', authMiddleware, roleMiddleware('ADMIN'), deleteStudent);
router.get('/food-claims', authMiddleware, roleMiddleware('ADMIN'), getFoodClaims);
router.get('/export/students', authMiddleware, roleMiddleware('ADMIN'), exportStudents);
router.get('/export/food-logs', authMiddleware, roleMiddleware('ADMIN'), exportFoodLogs);
router.post('/upload/students', authMiddleware, roleMiddleware('ADMIN'), upload.single('file'), bulkUploadStudents);
router.get('/download/template', authMiddleware, roleMiddleware('ADMIN'), downloadTemplate);

// User management routes
router.get('/users', authMiddleware, roleMiddleware('ADMIN'), getAllUsers);

export default router;
