const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot');
const { requireSignin } = require('../controllers/auth');
router.get('/retrieveSlots/:doctorID', slotController.all);
router.post('/slots', requireSignin, slotController.create);




module.exports = router;
