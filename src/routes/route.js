const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

router.post('/request', Controller.getRoast);
router.get('/data', Controller.getData);

module.exports = router;