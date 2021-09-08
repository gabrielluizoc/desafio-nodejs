const auth = require('./auth-controller');
const upload = require('./upload-controller');
const forgotPassword = require('./forgot-password-controller');
const admins = require('./admins');
const users = require('./users');

module.exports = {auth, upload, forgotPassword, admins, users}
