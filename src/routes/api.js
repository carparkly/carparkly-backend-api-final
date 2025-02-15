const express = require('express');
const router = express.Router();
const { testController } = require('../controllers/apiController');

router.get('/test', testController);

module.exports = router;
