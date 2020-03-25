"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      council_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      council_id: {
        type: Sequelize.STRING
      },
      first_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      role: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      failed_logins: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      terms_accepted: {
        type: Sequelize.DATE,
        allowNull: false
      },
      one_time_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      one_time_code_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
