var sequelize = require("../../../db/sequelize");
var mongoose = require("../../../db/mongoose");
var { validateUser } = require("../validate");
var winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: process.env.NODE_ENV },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}
const createUser = async function(userObject) {
  const validatedUser = validateUser(userObject);
  if (!validatedUser.success) {
    return validatedUser; // propagates errors
  }
  const errors = {};
  try {
    let council = await mongoose.councils.findOne({
      council_name: validatedUser.council_name
    });
    if (council) {
      errors.CU1 = "council already exists";
      return { success: false, errors };
    }
    council = await mongoose.councils.create({
      council_name: validatedUser.council_name
    });
    try {
      let user = await sequelize.users.findOne({
        where: { email: { [sequelize.Sequelize.Op.eq]: validatedUser.email } }
      });
      if (user) {
        errors.CU2 = "User already exists";
        await mongoose.councils.findByIdAndDelete(council.id.toString());
        return { success: false, errors };
      }
      const {
        email,
        first_name,
        last_name,
        council_name,
        invitation_code,
        terms_accepted
      } = validatedUser;
      const invite_code = await sequelize.invitations.findOne({
        where: {
          invitation_code: { [sequelize.Sequelize.Op.eq]: invitation_code }
        }
      });
      if (!invite_code) {
        errors.CU3 = "Invitation code does not exist";
        await mongoose.councils.findByIdAndDelete(council.id.toString());
        return { success: false, errors };
      }
      await sequelize.invitations.destroy({
        where: {
          invitation_code: { [sequelize.Sequelize.Op.eq]: invitation_code }
        }
      });
      user = await sequelize.users.create({
        email,
        first_name,
        last_name,
        council_name,
        council_id: council.id.toString(),
        terms_accepted
      });
      return { success: true, errors: null, user };
    } catch (userCreateError) {
      logger.error(
        `Could not create user ${JSON.stringify(
          userObject
        )} because: ${JSON.stringify(userCreateError)}`
      );
      // roll back council create if user cannot be created
      await mongoose.councils.findByIdAndDelete(council.id.toString());
      errors.CU0 = "Could not create user, removed council.";
      return { success: false, errors };
    }
  } catch (councilError) {
    await mongoose.councils.findOneAndDelete({
      council_name: validatedUser.council_name
    });
    logger.error(
      `Could not create council ${JSON.stringify(
        userObject
      )} due to: ${councilError}`
    );
    errors.CU0 = "Could not create council";
    return { success: false, errors };
  }
};
module.exports = { createUser };
