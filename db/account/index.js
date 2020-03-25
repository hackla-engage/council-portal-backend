var sequelize = require("../sequelize");
var winston = require("winston");
var argon2 = require("argon2");

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

function authenticate(username, password, done) {
  const email = username.toLowerCase();
  const errors = {};
  sequelize.users.findOne({
    where: { email: { [sequelize.Sequelize.Op.eq]: email } }
  })
    .then(async user => {
      if (!user) {
        logger.error(`LOGIN0: No user ${email}`);
        errors.LOGIN0 = "email/password combination is incorrect.";
        return done(null, false, { success: false, errors });
      }
      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        logger.error(`LOGIN0: Incorrect password for ${username}`);
        user.failed_logins = user.failed_logins + 1;
        await user.save();
        errors.LOGIN0 = "Username and/or password is incorrect.";
        return done(null, false, { success: false, errors });
      }
      return done(null, user);
    })
    .catch(e => {
      logger.error(`LOGIN0: unable to validate for user ${username} ${e}`);
      return done(e);
    });
}

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  sequelize.Users.findOne({ where: { id } })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
}

module.exports = { authenticate, serializeUser, deserializeUser };
