// controllers/courseAllocationController.js
const CourseOffering = require('../models').CourseOffering;
const Module = require('../models').Module;
const Facilitator = require('../models').Facilitator;
const Class = require('../models').Class;
const Mode = require('../models').Mode;
const ErrorResponse = require('../utils/errorHandler').ErrorResponse;

exports.getAllCourseOfferings = async (req, res, next) => {
  try {
    let filter = {};
    
    // Managers can see all, facilitators only their own
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { userId: req.user.id } });
      filter.facilitatorId = facilitator.id;
    }

    if (req.query.trimester) filter.trimester = req.query.trimester;
    if (req.query.cohort) filter.cohort = req.query.cohort;
    if (req.query.intake) filter.intake = req.query.intake;
    if (req.query.modeId) filter.modeId = req.query.modeId;

    const courseOfferings = await CourseOffering.findAll({
      where: filter,
      include: [
        { model: Module, attributes: ['code', 'name'] },
        { model: Facilitator, include: [{ model: User, attributes: ['name', 'email'] }] },
        { model: Class, attributes: ['name'] },
        { model: Mode, attributes: ['name'] }
      ]
    });

    res.status(200).json({
      success: true,
      count: courseOfferings.length,
      data: courseOfferings
    });
  } catch (err) {
    next(err);
  }
};

exports.createCourseOffering = async (req, res, next) => {
  try {
    const { moduleId, classId, facilitatorId, modeId, trimester, cohort, intake } = req.body;

    const courseOffering = await CourseOffering.create({
      moduleId,
      classId,
      facilitatorId,
      modeId,
      trimester,
      cohort,
      intake
    });

    res.status(201).json({
      success: true,
      data: courseOffering
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCourseOffering = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { moduleId, classId, facilitatorId, modeId, trimester, cohort, intake } = req.body;

    const courseOffering = await CourseOffering.findByPk(id);
    if (!courseOffering) {
      return next(new ErrorResponse(`Course offering not found with id ${id}`, 404));
    }

    await courseOffering.update({
      moduleId,
      classId,
      facilitatorId,
      modeId,
      trimester,
      cohort,
      intake
    });

    res.status(200).json({
      success: true,
      data: courseOffering
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourseOffering = async (req, res, next) => {
  try {
    const { id } = req.params;

    const courseOffering = await CourseOffering.findByPk(id);
    if (!courseOffering) {
      return next(new ErrorResponse(`Course offering not found with id ${id}`, 404));
    }

    await courseOffering.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};