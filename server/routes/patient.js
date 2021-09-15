const express = require('express')

const { patientById, allPatients, getPatient, updatePatient, deletePatient, patientPhoto, updatePatientRn } = require('../controllers/patients');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();


router.get("/patients", requireSignin, allPatients);
router.get("/patient/:patientId", requireSignin, getPatient);
router.put("/patient/:patientId", requireSignin, updatePatient);
router.put("/rn/patient/:patientId", requireSignin, updatePatientRn);
router.delete("/patient/:patientId", requireSignin, deletePatient);

//photo
router.get("/patient/photo/:patientId", patientPhoto);


router.param("patientId", patientById);

module.exports = router;