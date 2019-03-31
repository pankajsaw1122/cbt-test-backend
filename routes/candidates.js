const express = require('express');
const authCheck = require('../middleware/auth-token');
const candtController = require('../controller/candidates');

const router = express.Router();

router.post('/addCandt', authCheck, candtController.addCandt);
router.get('/getCandtData', authCheck, candtController.getCandtData);
router.get('/checkStartExam', authCheck, candtController.checkStartExam);
router.get('/setLoggedIn', authCheck, candtController.setLoggedIn);
router.post('/updateCandt', authCheck, candtController.updateCandt);
router.delete('/deleteCandt', authCheck, candtController.deleteCandt);



console.log('In routes');

module.exports = router;