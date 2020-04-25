const express = require('express');
const authCheck = require('../middleware/auth-token');
const categController = require('../controller/categ');

const router = express.Router();

router.post('/addQuesCateg', authCheck, categController.addQuesCateg);
router.get('/getCategData', authCheck, categController.getCategData);
router.get('/getCategList', authCheck, categController.getCategList);
router.put('/updateQuesCateg', authCheck, categController.updateQuesCateg);
router.delete('/deleteQuesCateg', authCheck, categController.deleteQuesCateg);

module.exports = router;