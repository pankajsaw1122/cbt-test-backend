const express = require('express');

const registerController = require('../controller/register');

const router = express.Router();

router.post('/candidate', registerController.registerCandidate);
router.post('/admin', registerController.registerAdmin);

module.exports = router;