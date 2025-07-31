const express = require('express');
const router = express.Router();
const courseAllocationController = require('../controllers/courseAllocationController');
const { protect, authorize } = require('../middlewares/auth');

// Manager routes
router.post('/', 
  protect, 
  authorize('manager'), 
  courseAllocationController.createCourseOffering
);

router.get('/', 
  protect, 
  authorize('manager'), 
  courseAllocationController.getAllCourseOfferings
);

router.get('/:id', 
  protect, 
  authorize('manager'), 
  courseAllocationController.getCourseOfferingById
);

router.put('/:id', 
  protect, 
  authorize('manager'), 
  courseAllocationController.updateCourseOffering
);

router.delete('/:id', 
  protect, 
  authorize('manager'), 
  courseAllocationController.deleteCourseOffering
);

// Facilitator routes
router.get('/me/my-courses', 
  protect, 
  authorize('facilitator'), 
  courseAllocationController.getMyCourses
);

module.exports = router;