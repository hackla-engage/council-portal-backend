'use strict';
module.exports = (sequelize, DataTypes) => {
  const invitations = sequelize.define('invitations', {
    invitation_code: DataTypes.STRING
  }, {});
  invitations.associate = function(models) {
    // associations can be defined here
  };
  return invitations;
};