const express = require('express');
const authCheck = require('../middleware/auth-token');
const resultController = require('../controller/result');

const router = express.Router();

// router.get('/examStats', authCheck, resultController.examStats);
router.get('/getMarksData', authCheck, resultController.getMarksData);
router.post('/saveResult', authCheck, resultController.saveResult);

module.exports = router;