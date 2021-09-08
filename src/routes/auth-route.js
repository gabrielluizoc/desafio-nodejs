const express = require('express');
const router = express.Router();
const methods = require('../controllers').auth;


router.post('/verify-email',methods.verifyEmail);
router.get('/verify-token',methods.verifyToken);
router.post('/register', methods.register);
router.post('/authenticate',methods.authenticate);

module.exports = app => app.use('/auth', router);
