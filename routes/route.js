const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

router.post('/request', Controller.requestRoast);
router.get('/data', Controller.requestData);

module.exports = router;