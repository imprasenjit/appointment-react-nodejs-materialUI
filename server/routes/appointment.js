const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointments')
const slotController = require('../controllers/slot')
const { requireSignin } = require('../controllers/auth');

router.get('/appointments', requireSignin, appointmentController.all);
router.get('/retrieveSlots', slotController.all);
router.post('/appointmentCreate', appointmentController.create);




module.exports = router;
