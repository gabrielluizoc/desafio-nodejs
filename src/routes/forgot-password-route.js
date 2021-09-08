const express = require('express');
const router = express.Router();
const methods = require('../controllers').forgotPassword;


router.post('/recovery',methods.recoveryPasswordByEmail);
router.put('/:token',methods.putPassword);

module.exports = app => app.use('/user/forgot-password', router);
