// models/courseOffering.js
module.exports = (sequelize, DataTypes) => {
  const CourseOffering = sequelize.define('CourseOffering', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trimester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cohort: {
      type: DataTypes.STRING,
      allowNull: false
    },
    intake: {
      type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'course_offerings'
  });

  CourseOffering.associate = (models) => {
    CourseOffering.belongsTo(models.Module, { foreignKey: 'moduleId' });
    CourseOffering.belongsTo(models.Class, { foreignKey: 'classId' });
    CourseOffering.belongsTo(models.Facilitator, { foreignKey: 'facilitatorId' });
    CourseOffering.belongsTo(models.Mode, { foreignKey: 'modeId' });
    CourseOffering.hasMany(models.ActivityTracker, { foreignKey: 'courseOfferingId' });
  };

  return CourseOffering;
};