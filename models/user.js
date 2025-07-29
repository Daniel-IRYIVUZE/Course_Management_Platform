// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('manager', 'facilitator', 'student'),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasOne(models.Facilitator, { foreignKey: 'userId' });
    User.hasOne(models.Student, { foreignKey: 'userId' });
  };

  return User;
};