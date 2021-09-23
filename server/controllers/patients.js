const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const Patient = require('../models/patient');

exports.patientById = (req, res, next, id) => {
    Patient.findById(id)
        .select('name email ')
        .exec((err, patient) => {
            if (err || !patient) {
                return res.status(400).json({
                    error: "Patient not found"
                });
            }
            // add profile object in request with patient info
            req.profile = patient;
            next();
        });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && (req.profile._id === req.auth._id);
    if (!authorized) {
        return res.status(403).json({
            error: "patient is not authorized to perform this action"
        });
    }
};

exports.allPatients = (req, res) => {
    Patient.find((err, patients) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        return res.json(patients);
    })
        .select("name email address mobile fhir_id updated created about notificationToken photo");
};

exports.getPatient = (req, res) => {
    // set hashed_password and salt undefined since we dont want it in response while viewing single patient
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};


exports.updatePatient = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        //save patient
        let patient = req.profile;
        patient = _.extend(patient, fields);
        patient.updated = Date.now();

        if (files.photo) {
            patient.photo.data = fs.readFileSync(files.photo.path);
            patient.photo.contentType = files.photo.type;
        }
        patient.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            patient.hashed_password = undefined;
            patient.salt = undefined;
            res.json(patient);
        });
    });
};


exports.updatePatientRn = (req, res) => {

    let patient = req.profile;
    console.log(req.body);
    patient = _.extend(patient, req.body);

    patient.updated = Date.now();

    patient.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        patient.hashed_password = undefined;
        patient.salt = undefined;
        res.json(patient);
    });
};

exports.patientPhoto = (req, res, next) => {
    Patient.findById(req.params.patientId, (err, patient) => {
        if (err || !patient) {
            res.status(400).json({
                error: err
            })
        }
        if (patient.photo) {
            return res.send(patient.photo);
        }
        next();
    })
};

exports.deletePatient = (req, res, next) => {
    let patient = req.profile;
    patient.deleteOne((err, patient) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "Patient deleted successfully" });
    });
};


