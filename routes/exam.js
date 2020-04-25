const express = require('express');
const authCheck = require('../middleware/auth-token');
const examController = require('../controller/exam');

const router = express.Router();

router.post('/addExam', authCheck, examController.addExam);
router.post('/updateExam', authCheck, examController.updateExam);
router.get('/getExamData', authCheck, examController.getExamData);
router.get('/fetchQuestionsList', authCheck, examController.fetchQuestionsList);
router.get('/getExamQuesData', authCheck, examController.getExamQuesData);

router.delete('/deleteExam', authCheck, examController.deleteExam);
router.get('/finishExam', authCheck, examController.finishExam);

module.exports = router;