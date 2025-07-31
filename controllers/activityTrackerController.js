const { ActivityTracker, CourseOffering, User } = require('../models');
const { Op } = require('sequelize');
const notificationService = require('../services/notificationService');

exports.createActivityLog = async (req, res) => {
  try {
    const { courseOfferingId, weekNumber, attendance, formativeOneGrading, 
      formativeTwoGrading, summativeGrading, courseModeration, 
      intranetSync, gradeBookStatus, comments } = req.body;

    // Check if the user is the facilitator for this course offering
    const courseOffering = await CourseOffering.findByPk(courseOfferingId);
    if (!courseOffering || courseOffering.facilitatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create log for this course'
      });
    }

    // Check if log already exists for this week
    const existingLog = await ActivityTracker.findOne({
      where: {
        courseOfferingId,
        weekNumber
      }
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'Activity log already exists for this week'
      });
    }

    // Create new activity log
    const activityLog = await ActivityTracker.create({
      courseOfferingId,
      weekNumber,
      attendance,
      formativeOneGrading,
      formativeTwoGrading,
      summativeGrading,
      courseModeration,
      intranetSync,
      gradeBookStatus,
      comments
    });

    // Send notification to manager
    await notificationService.sendManagerAlert(
      req.user.id,
      courseOfferingId,
      weekNumber,
      'submitted'
    );

    res.status(201).json({
      success: true,
      data: activityLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateActivityLog = async (req, res) => {
  try {
    const { attendance, formativeOneGrading, formativeTwoGrading, 
      summativeGrading, courseModeration, intranetSync, 
      gradeBookStatus, comments } = req.body;

    const activityLog = await ActivityTracker.findByPk(req.params.id, {
      include: [
        { 
          model: CourseOffering,
          as: 'courseOffering',
          attributes: ['facilitatorId']
        }
      ]
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      });
    }

    // Check if the user is the facilitator for this course offering
    if (activityLog.courseOffering.facilitatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this log'
      });
    }

    // Update the log
    activityLog.attendance = attendance || activityLog.attendance;
    activityLog.formativeOneGrading = formativeOneGrading || activityLog.formativeOneGrading;
    activityLog.formativeTwoGrading = formativeTwoGrading || activityLog.formativeTwoGrading;
    activityLog.summativeGrading = summativeGrading || activityLog.summativeGrading;
    activityLog.courseModeration = courseModeration || activityLog.courseModeration;
    activityLog.intranetSync = intranetSync || activityLog.intranetSync;
    activityLog.gradeBookStatus = gradeBookStatus || activityLog.gradeBookStatus;
    activityLog.comments = comments || activityLog.comments;

    await activityLog.save();

    res.status(200).json({
      success: true,
      data: activityLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const activityLog = await ActivityTracker.findByPk(req.params.id, {
      include: [
        { 
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Cohort, as: 'cohort' },
            { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName'] }
          ]
        }
      ]
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found'
      });
    }

    // Check if the user is the facilitator or a manager
    if (activityLog.courseOffering.facilitatorId !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this log'
      });
    }

    res.status(200).json({
      success: true,
      data: activityLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getActivityLogsByCourse = async (req, res) => {
  try {
    const { courseOfferingId } = req.params;

    // Check if the user is the facilitator or a manager
    const courseOffering = await CourseOffering.findByPk(courseOfferingId);
    if (!courseOffering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    if (courseOffering.facilitatorId !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these logs'
      });
    }

    const activityLogs = await ActivityTracker.findAll({
      where: { courseOfferingId },
      order: [['weekNumber', 'ASC']],
      include: [
        { 
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Cohort, as: 'cohort' }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getActivityLogsByFacilitator = async (req, res) => {
  try {
    const { facilitatorId } = req.params;

    // Only managers can view logs by other facilitators
    if (facilitatorId !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these logs'
      });
    }

    const activityLogs = await ActivityTracker.findAll({
      include: [
        { 
          model: CourseOffering,
          as: 'courseOffering',
          where: { facilitatorId },
          include: [
            { model: Module, as: 'module' },
            { model: Cohort, as: 'cohort' }
          ]
        }
      ],
      order: [['weekNumber', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getMyActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityTracker.findAll({
      include: [
        { 
          model: CourseOffering,
          as: 'courseOffering',
          where: { facilitatorId: req.user.id },
          include: [
            { model: Module, as: 'module' },
            { model: Cohort, as: 'cohort' }
          ]
        }
      ],
      order: [['weekNumber', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};