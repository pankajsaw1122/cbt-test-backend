const express = require('express');
const authCheck = require('../middleware/auth-token');


const quesController = require('../controller/ques');

const router = express.Router();

router.post('/addQuesCateg', authCheck, quesController.addQuesCateg);
router.post('/addQues', authCheck, quesController.addQues);
router.post('/addChoice', authCheck, quesController.addChoice);

// router.post('/addQues', authCheck, quesController.addQues);

console.log('In routes');

module.exports = router;