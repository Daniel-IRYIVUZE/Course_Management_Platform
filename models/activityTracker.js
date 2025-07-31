const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ActivityTracker = sequelize.define('ActivityTracker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseOfferingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'course_offerings',
      key: 'id'
    }
  },
  weekNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attendance: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  formativeOneGrading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  formativeTwoGrading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  summativeGrading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  courseModeration: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  intranetSync: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  gradeBookStatus: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  comments: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'activity_trackers'
});

module.exports = ActivityTracker;