const express = require('express');
const authCheck = require('../middleware/auth-token');


const ansController = require('../controller/answer');

const router = express.Router();

router.post('/addAnswer', authCheck, ansController.addAnswer);
router.post('/removeAnswer', authCheck, ansController.removeAnswer);


console.log('In routes');

module.exports = router;