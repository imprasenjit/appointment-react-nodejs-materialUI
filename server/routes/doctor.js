const express = require('express')

const { requireSignin } = require('../controllers/auth');
const { doctorById, allDoctors, updateDoctor, getDoctor, deleteDoctor, createDoctor } = require('../controllers/doctor');
const { doctorSignupValidator } = require('../validator/index');


const router = express.Router();

router.get("/doctors", allDoctors);
router.get("/doctor/:doctorsID", requireSignin, getDoctor);
// router.put("/doctor/:doctorsID", requireSignin, updateDoctor);
router.put("/doctor", doctorSignupValidator, createDoctor);
router.put("/doctor/:doctorsID", updateDoctor);
router.delete("/doctor/:doctorsID", requireSignin, deleteDoctor);



// any route containing :doctorsID, this is execute first
router.param("doctorsID", doctorById);

module.exports = router;