const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Intake = sequelize.define('Intake', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(100)
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'intakes'
});

module.exports = Intake;