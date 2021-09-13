const express = require('express');
const router = express.Router();

const slotController = require('../controllers/slot')
const slotController = require('../controllers/slot')
const { requireSignin } = require('../controllers/auth');

router.get('/slots', requireSignin, appointmentController.all);




module.exports = router;
