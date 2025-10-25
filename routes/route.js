const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

router.post('/request', Controller.requestRoast);

module.exports = router;