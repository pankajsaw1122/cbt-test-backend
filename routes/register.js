const express = require('express');

const registerController = require('../controller/register');

const router = express.Router();

router.post('/candidate', registerController.registerCandidate);
router.post('/admin', registerController.registerAdmin);

console.log('In routes');

module.exports = router;