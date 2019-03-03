const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.post('/login', authController.authAdmin);
console.log('In routes');

module.exports = router;