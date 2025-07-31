const sequelize = require('./database');
const User = require('./User');
const Module = require('./Module');
const Cohort = require('./Cohort');
const Class = require('./Class');
const Mode = require('./Mode');
const Trimester = require('./Trimester');
const Intake = require('./Intake');
const CourseOffering = require('./CourseOffering');
const ActivityTracker = require('./ActivityTracker');
const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect, // This should be 'mysql'
    logging: config.logging,
    pool: config.pool
  }
);
// User Relationships
User.hasMany(CourseOffering, {
  foreignKey: 'facilitatorId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(User, {
  foreignKey: 'facilitatorId',
  as: 'facilitator'
});

// Module Relationships
Module.hasMany(CourseOffering, {
  foreignKey: 'moduleId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Module, {
  foreignKey: 'moduleId',
  as: 'module'
});

// Cohort Relationships
Cohort.hasMany(CourseOffering, {
  foreignKey: 'cohortId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Cohort, {
  foreignKey: 'cohortId',
  as: 'cohort'
});

// Class Relationships
Class.hasMany(CourseOffering, {
  foreignKey: 'classId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});

// Trimester Relationships
Trimester.hasMany(CourseOffering, {
  foreignKey: 'trimesterId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Trimester, {
  foreignKey: 'trimesterId',
  as: 'trimester'
});

// Intake Relationships
Intake.hasMany(CourseOffering, {
  foreignKey: 'intakeId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Intake, {
  foreignKey: 'intakeId',
  as: 'intake'
});

// Mode Relationships
Mode.hasMany(CourseOffering, {
  foreignKey: 'modeId',
  as: 'courseOfferings'
});
CourseOffering.belongsTo(Mode, {
  foreignKey: 'modeId',
  as: 'mode'
});

// Activity Tracker Relationships
CourseOffering.hasMany(ActivityTracker, {
  foreignKey: 'courseOfferingId',
  as: 'activityLogs'
});
ActivityTracker.belongsTo(CourseOffering, {
  foreignKey: 'courseOfferingId',
  as: 'courseOffering'
});

module.exports = {
  sequelize,
  User,
  Module,
  Cohort,
  Class,
  Mode,
  Trimester,
  Intake,
  CourseOffering,
  ActivityTracker
};