const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moduleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules',
      key: 'id'
    }
  },
  cohortId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  trimesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trimesters',
      key: 'id'
    }
  },
  intakeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'intakes',
      key: 'id'
    }
  },
  modeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modes',
      key: 'id'
    }
  },
  facilitatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'course_offerings'
});

module.exports = CourseOffering;