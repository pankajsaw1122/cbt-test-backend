const express = require('express');

const authController = require('../controller/auth');
const authCheck = require('../middleware/auth-token');

const router = express.Router();

router.post('/login', authController.authAdmin);
router.post('/candtLogin', authController.authCandt);

router.post('/changePassword', authCheck, authController.changePassword);


module.exports = router;