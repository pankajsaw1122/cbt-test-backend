const express = require('express');
const authCheck = require('../middleware/auth-token');
const manageExamController = require('../controller/manageExam');

const router = express.Router();

router.post('/allowLogin', authCheck, manageExamController.allowLogin);
router.get('/getExamInfo', authCheck, manageExamController.getExamInfo);
router.post('/allowStartExam', authCheck, manageExamController.allowStartExam);
// router.delete('/deleteCandt', authCheck, candtController.deleteCandt);

console.log('In routes');

module.exports = router;