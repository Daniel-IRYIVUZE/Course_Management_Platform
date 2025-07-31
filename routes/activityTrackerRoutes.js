const express = require('express');
const router = express.Router();
const activityTrackerController = require('../controllers/activityTrackerController');
const { protect, authorize } = require('../middlewares/auth');

// Facilitator routes
router.post('/', 
  protect, 
  authorize('facilitator'), 
  activityTrackerController.createActivityLog
);

router.put('/:id', 
  protect, 
  authorize('facilitator'), 
  activityTrackerController.updateActivityLog
);

router.get('/me', 
  protect, 
  authorize('facilitator'), 
  activityTrackerController.getMyActivityLogs
);

router.get('/:id', 
  protect, 
  authorize(['facilitator', 'manager']), 
  activityTrackerController.getActivityLog
);

// Manager routes
router.get('/course/:courseOfferingId', 
  protect, 
  authorize('manager'), 
  activityTrackerController.getActivityLogsByCourse
);

router.get('/facilitator/:facilitatorId', 
  protect, 
  authorize('manager'), 
  activityTrackerController.getActivityLogsByFacilitator
);

module.exports = router;