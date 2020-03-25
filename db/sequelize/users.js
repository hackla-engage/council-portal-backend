"use strict";
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: DataTypes.STRING,
      council_name: { type: DataTypes.STRING, allowNull: false },
      council_id: DataTypes.STRING,
      first_login: { type: DataTypes.BOOLEAN, defaultValue: true },
      role: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 = user, 1 = reviewer, 2 = site admin, 3 = owner
      failed_logins: { type: DataTypes.INTEGER, defaultValue: 0 },
      terms_accepted: { type: DataTypes.DATE, allowNull: false },
      one_time_code: { type: DataTypes.STRING, allowNull: true },
      one_time_code_date: { type: DataTypes.DATE, allowNull: true },
      blocked: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {}
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
