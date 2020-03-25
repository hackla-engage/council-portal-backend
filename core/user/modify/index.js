const modifyUser = async (userToModify, userModifying, change = {}) => {
  const errors = {};
  if (change.role != null && userModifying.role > change.role) {
    try {
      userToModify.role = change.role;
      await userToModify.save();
      return { success: true, errors: null, user: userToModify };
    } catch (err) {
      errors.MU1 = "Could not modify user role";
      return { success: false, errors };
    }
  }
  return {success: false, errors}
};

module.exports = { modifyUser };
