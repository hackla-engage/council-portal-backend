const NAME_REGEXP = new RegExp("^[a-z0-9,.\\-' ]+$", "i");
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const INVITATION_REGEXP = new RegExp("^[0-9a-z]{8}$", "i");
module.exports = { NAME_REGEXP, EMAIL_REGEXP, INVITATION_REGEXP };
