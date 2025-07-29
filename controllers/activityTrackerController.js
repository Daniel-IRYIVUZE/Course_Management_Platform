// controllers/activityTrackerController.js
const ActivityTracker = require('../models').ActivityTracker;
const CourseOffering = require('../models').CourseOffering;
const Facilitator = require('../models').Facilitator;
const { sendNotification } = require('../services/notificationService');
const ErrorResponse = require('../utils/errorHandler').ErrorResponse;

exports.getActivityLogs = async (req, res, next) => {
  try {
    let filter = {};
    
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { userId: req.user.id } });
      const courseOfferings = await CourseOffering.findAll({ where: { facilitatorId: facilitator.id } });
      filter.courseOfferingId = courseOfferings.map(co => co.id);
    }

    if (req.query.weekNumber) filter.weekNumber = req.query.weekNumber;
    if (req.query.courseOfferingId) filter.courseOfferingId = req.query.courseOfferingId;

    const activityLogs = await ActivityTracker.findAll({
      where: filter,
      include: [
        { 
          model: CourseOffering,
          include: [
            { model: Module, attributes: ['code', 'name'] },
            { model: Facilitator, include: [{ model: User, attributes: ['name', 'email'] }] }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs
    });
  } catch (err) {
    next(err);
  }
};

exports.createActivityLog = async (req, res, next) => {
  try {
    const { courseOfferingId, weekNumber, attendance, formativeOneGrading, 
            formativeTwoGrading, summativeGrading, courseModeration, 
            intranetSync, gradeBookStatus } = req.body;

    // Verify the facilitator owns this course offering
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { userId: req.user.id } });
      const courseOffering = await CourseOffering.findByPk(courseOfferingId);
      
      if (!courseOffering || courseOffering.facilitatorId !== facilitator.id) {
        return next(new ErrorResponse('Not authorized to create log for this course', 403));
      }
    }

    const activityLog = await ActivityTracker.create({
      courseOfferingId,
      weekNumber,
      attendance,
      formativeOneGrading,
      formativeTwoGrading,
      summativeGrading,
      courseModeration,
      intranetSync,
      gradeBookStatus
    });

    // Send notification to manager
    await sendNotification({
      type: 'activity_log_submitted',
      userId: req.user.id,
      message: `New activity log submitted for week ${weekNumber}`,
      data: { activityLogId: activityLog.id }
    });

    res.status(201).json({
      success: true,
      data: activityLog
    });
  } catch (err) {
    next(err);
  }
};

exports.updateActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attendance, formativeOneGrading, formativeTwoGrading, 
            summativeGrading, courseModeration, intranetSync, gradeBookStatus } = req.body;

    const activityLog = await ActivityTracker.findByPk(id, {
      include: [
        { 
          model: CourseOffering,
          include: [
            { model: Facilitator }
          ]
        }
      ]
    });

    if (!activityLog) {
      return next(new ErrorResponse(`Activity log not found with id ${id}`, 404));
    }

    // Verify the facilitator owns this log
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { userId: req.user.id } });
      
      if (activityLog.CourseOffering.facilitatorId !== facilitator.id) {
        return next(new ErrorResponse('Not authorized to update this log', 403));
      }
    }

    await activityLog.update({
      attendance: attendance || activityLog.attendance,
      formativeOneGrading: formativeOneGrading || activityLog.formativeOneGrading,
      formativeTwoGrading: formativeTwoGrading || activityLog.formativeTwoGrading,
      summativeGrading: summativeGrading || activityLog.summativeGrading,
      courseModeration: courseModeration || activityLog.courseModeration,
      intranetSync: intranetSync || activityLog.intranetSync,
      gradeBookStatus: gradeBookStatus || activityLog.gradeBookStatus
    });

    res.status(200).json({
      success: true,
      data: activityLog
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const activityLog = await ActivityTracker.findByPk(id, {
      include: [
        { 
          model: CourseOffering,
          include: [
            { model: Facilitator }
          ]
        }
      ]
    });

    if (!activityLog) {
      return next(new ErrorResponse(`Activity log not found with id ${id}`, 404));
    }

    // Only managers can delete logs
    if (req.user.role !== 'manager') {
      return next(new ErrorResponse('Not authorized to delete activity logs', 403));
    }

    await activityLog.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};