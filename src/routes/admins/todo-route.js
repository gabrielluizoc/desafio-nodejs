const express = require('express');
const router = express.Router();
const methods = require('../../controllers').admins.todo;
const  authMiddleware = require('../../middleware/auth-middleware');

router.use(authMiddleware);

router.get('/tasks',methods.getTasks);

module.exports = app => app.use('/admins/todo', router);
