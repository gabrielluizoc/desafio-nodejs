const auth = require('./auth-route');
const upload = require('./upload-route');
const forgotPassword = require('./forgot-password-route');

const admins = require('./admins');
const users = require('./users');

module.exports = {auth, upload, forgotPassword, admins, users};
