// routes/activityTrackerRoutes.js
const express = require('express');
const router = express.Router();
const activityTrackerController = require('../controllers/activityTrackerController');
const { protect, authorize } = require('../utils/authMiddleware');

router
  .route('/')
  .get(protect, activityTrackerController.getActivityLogs)
  .post(protect, authorize('facilitator'), activityTrackerController.createActivityLog);

router
  .route('/:id')
  .put(protect, authorize('facilitator'), activityTrackerController.updateActivityLog)
  .delete(protect, authorize('manager'), activityTrackerController.deleteActivityLog);

module.exports = router;