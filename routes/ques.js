const express = require('express');
const authCheck = require('../middleware/auth-token');


const quesController = require('../controller/ques');

const router = express.Router();
router.get('/getQuesType', authCheck, quesController.getQuesType);

router.post('/addQues', authCheck, quesController.addQues);
router.post('/updateQues', authCheck, quesController.updateQues);

router.get('/getQuesData', authCheck, quesController.getQuesData);
router.delete('/deleteQues', authCheck, quesController.deleteQues);


// router.post('/addQues', authCheck, quesController.addQues);

console.log('In routes');

module.exports = router;