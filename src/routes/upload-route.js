const express = require('express');
const router = express.Router();
const methods = require('../controllers').upload;
const authMiddleware = require('./../middleware/auth-middleware');
const upload = require('multer')({ dest: 'uploads/' });

router.use(authMiddleware);
router.post('/', upload.single('file'), methods.upload);

module.exports = app => app.use('/upload', router);
