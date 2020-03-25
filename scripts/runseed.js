const createUser = require("../core/user/create").createUser;
const modifyUser = require("../core/user/modify").modifyUser;
const createInvitationCode = require("../core/invitationCode/create")
  .createInvitationCode;
const a = async () => {
  try {
    const invitation_code1 = await createInvitationCode();
    const user1 = await createUser({
      email: "eli.j.selkin@gmail.com",
      first_name: "Eli",
      last_name: "Da'Andre-Jones",
      council_name: "Santa Monica City Council",
      invitation_code: invitation_code1,
      terms_accepted: true
    });
    if (user1.success) {
      console.log(user1.user.id);
    } else {
      console.error("something happened with user1");
    }
    const invitation_code2 = await createInvitationCode();
    const user2 = await createUser({
      email: "eli@upful.ai",
      first_name: "Eli",
      last_name: "Da'Andre-Jones",
      council_name: "Santa Monica City Council2",
      invitation_code: invitation_code2,
      terms_accepted: true
    });
    if (user2.success) {
      user1.user.role = 2;
      await user1.user.save();
      const change = { role: 1 };
      const modifiedUser = await modifyUser(user2.user, user1.user, change);
      console.error(modifiedUser);
    }
  } catch (err) {
    console.error(err);
  }
};

a();
