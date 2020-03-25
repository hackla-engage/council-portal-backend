const sequelize = require("../../../db/sequelize");
const uuidv4 = require("uuid").v4;
const createInvitationCode = () => {
  const uuidstring = uuidv4()
    .toString()
    .replace(/-/g, "");
  const invitation = sequelize.invitations.create({
    invitation_code: uuidstring.substring(0, 8)
  });
  return uuidstring.substring(0, 8);
};

module.exports = { createInvitationCode };
