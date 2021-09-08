const express = require('express');
const router = express.Router();
const methods = require('../../controllers').users.todo;
const  authMiddleware = require('../../middleware/auth-middleware');

router.use(authMiddleware);
router.post('/',methods.postToDoList);
router.get('/',methods.getToDoListByIdUser);
router.patch('/:idToDoList', methods.patchToDoListByIdUser);

router.post('/:idToDoList/tasks',methods.postTask);
router.get('/:idToDoList/tasks',methods.getTasksByIdToDoList);
router.patch('/:idToDoList/tasks/:idTask',methods.patchTaskByIdToDoList);

module.exports = app => app.use('/users/todo', router);
