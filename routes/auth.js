const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.post('/login', authController.authAdmin);
router.post('/changePassword', authController.changePassword);

router.post('/candtLogin', authController.authCandt);
console.log('In routes');

module.exports = router;