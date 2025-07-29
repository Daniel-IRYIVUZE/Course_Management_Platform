// routes/courseAllocationRoutes.js
const express = require('express');
const router = express.Router();
const courseAllocationController = require('../controllers/courseAllocationController');
const { protect, authorize } = require('../utils/authMiddleware');

router
  .route('/')
  .get(protect, courseAllocationController.getAllCourseOfferings)
  .post(protect, authorize('manager'), courseAllocationController.createCourseOffering);

router
  .route('/:id')
  .put(protect, authorize('manager'), courseAllocationController.updateCourseOffering)
  .delete(protect, authorize('manager'), courseAllocationController.deleteCourseOffering);

module.exports = router;