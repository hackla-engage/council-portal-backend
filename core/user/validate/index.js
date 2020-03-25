const {
  NAME_REGEXP,
  EMAIL_REGEXP,
  INVITATION_REGEXP
} = require("../../common/validation/regexps");

const validateUser = function(userObject) {
  const {
    first_name,
    last_name,
    email,
    council_name,
    invitation_code,
    terms_accepted
  } = userObject;
  const errors = {};
  if (!first_name || !NAME_REGEXP.test(first_name) || !first_name.trim()) {
    errors.VU1 =
      "First name should only contain characters a-zA-Z0-9,.- or space";
  }
  if (!last_name || !NAME_REGEXP.test(last_name) || !last_name.trim()) {
    errors.VU2 =
      "Last name should only contain characters a-zA-Z0-9,.- or space";
  }
  if (!email || !EMAIL_REGEXP.test(email)) {
    console.error(EMAIL_REGEXP.test(email));
    errors.VU3 = "Email should be standard format";
  }
  if (
    !council_name ||
    !NAME_REGEXP.test(council_name) ||
    !council_name.trim()
  ) {
    errors.VU4 =
      "Council name should only contain characters a-zA-Z0-9,.- or space";
  }
  if (!invitation_code || !INVITATION_REGEXP.test(invitation_code)) {
    errors.VU5 = "Invitation code should contain exactly 8 characters";
  }
  if (!terms_accepted) {
    errors.VU6 = "Terms must be accepted to create account"
  }
  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  } else {
    return Object.assign({}, userObject, {
      email: email.toLowerCase(),
      invitation_code: invitation_code.toLowerCase(),
      errors: null,
      success: true
    });
  }
};

module.exports = { validateUser };
