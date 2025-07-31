const { CourseOffering, Module, Cohort, Class, Trimester, Intake, Mode, User } = require('../models');
const { Op } = require('sequelize');

exports.createCourseOffering = async (req, res) => {
  try {
    const { moduleId, cohortId, classId, trimesterId, intakeId, modeId, facilitatorId } = req.body;

    // Check if the course offering already exists
    const existingOffering = await CourseOffering.findOne({
      where: {
        moduleId,
        cohortId,
        classId,
        trimesterId,
        intakeId,
        modeId
      }
    });

    if (existingOffering) {
      return res.status(400).json({
        success: false,
        message: 'Course offering already exists'
      });
    }

    // Create new course offering
    const courseOffering = await CourseOffering.create({
      moduleId,
      cohortId,
      classId,
      trimesterId,
      intakeId,
      modeId,
      facilitatorId
    });

    // Fetch the full details with associations
    const newOffering = await CourseOffering.findByPk(courseOffering.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Trimester, as: 'trimester' },
        { model: Intake, as: 'intake' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: newOffering
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getAllCourseOfferings = async (req, res) => {
  try {
    const { trimesterId, cohortId, intakeId, facilitatorId, modeId } = req.query;
    
    const whereClause = {};
    
    if (trimesterId) whereClause.trimesterId = trimesterId;
    if (cohortId) whereClause.cohortId = cohortId;
    if (intakeId) whereClause.intakeId = intakeId;
    if (facilitatorId) whereClause.facilitatorId = facilitatorId;
    if (modeId) whereClause.modeId = modeId;

    const courseOfferings = await CourseOffering.findAll({
      where: whereClause,
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Trimester, as: 'trimester' },
        { model: Intake, as: 'intake' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(200).json({
      success: true,
      count: courseOfferings.length,
      data: courseOfferings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getCourseOfferingById = async (req, res) => {
  try {
    const courseOffering = await CourseOffering.findByPk(req.params.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Trimester, as: 'trimester' },
        { model: Intake, as: 'intake' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!courseOffering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    res.status(200).json({
      success: true,
      data: courseOffering
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateCourseOffering = async (req, res) => {
  try {
    const { facilitatorId } = req.body;

    const courseOffering = await CourseOffering.findByPk(req.params.id);

    if (!courseOffering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    // Update only the facilitator
    courseOffering.facilitatorId = facilitatorId || courseOffering.facilitatorId;
    await courseOffering.save();

    // Fetch the updated offering with associations
    const updatedOffering = await CourseOffering.findByPk(courseOffering.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Trimester, as: 'trimester' },
        { model: Intake, as: 'intake' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedOffering
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.deleteCourseOffering = async (req, res) => {
  try {
    const courseOffering = await CourseOffering.findByPk(req.params.id);

    if (!courseOffering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    await courseOffering.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const courseOfferings = await CourseOffering.findAll({
      where: { facilitatorId: req.user.id },
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Trimester, as: 'trimester' },
        { model: Intake, as: 'intake' },
        { model: Mode, as: 'mode' }
      ]
    });

    res.status(200).json({
      success: true,
      count: courseOfferings.length,
      data: courseOfferings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};