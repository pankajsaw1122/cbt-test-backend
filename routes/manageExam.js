const express = require('express');
const authCheck = require('../middleware/auth-token');
const manageExamController = require('../controller/manageExam');

const router = express.Router();

router.post('/allowLogin', authCheck, manageExamController.allowLogin);
router.get('/getExamInfo', authCheck, manageExamController.getExamInfo);
router.post('/allowStartExam', authCheck, manageExamController.allowStartExam);
router.get('/examStats', authCheck, manageExamController.examStats);
router.get('/getExamStatus', authCheck, manageExamController.getExamStatus);
router.post('/stopExam', authCheck, manageExamController.stopExam);

// router.delete('/deleteCandt', authCheck, candtController.deleteCandt);

module.exports = router;