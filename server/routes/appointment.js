const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointments');
const { requireSignin } = require('../controllers/auth');

router.get('/appointments', requireSignin, appointmentController.all);
router.post('/getAvailableSlots', appointmentController.getAvailableSlots);
router.post('/appointmentCreate', appointmentController.create);
router.post('/appointment/cancel', appointmentController.cancel);




module.exports = router;
