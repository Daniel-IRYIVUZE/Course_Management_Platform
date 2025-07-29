// models/module.js
module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    tableName: 'modules'
  });

  Module.associate = (models) => {
    Module.hasMany(models.CourseOffering, { foreignKey: 'moduleId' });
  };

  return Module;
};