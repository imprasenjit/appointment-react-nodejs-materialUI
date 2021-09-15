const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const Doctor = require('../models/doctor');
exports.doctorById = (req, res, next, id) => {
    Doctor.findById(id)
        .select('name email photo created about')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Doctor not found"
                });
            }
            // add profile object in request with user info
            req.profile = user;
            next();
        });
};
exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && (req.profile._id === req.auth._id);
    if (!authorized) {
        return res.status(403).json({
            error: "user is not authorized to perform this action"
        });
    }
};
exports.allDoctors = (req, res) => {
    Doctor.find((err, users) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        return res.json(users);
    }).select("name email updated created about notificationToken photo");
};
exports.getDoctor = (req, res) => {
    // set hashed_password and salt undefined since we dont want it in response while viewing single user
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
exports.createDoctor = async (req, res) => {
    var email = req.body.email; //Extract title from input form
    await Doctor.findOne({ email: email }, async (err, example) => {
        if (err) console.log(err);
        if (example) {
            return res.status(400).json({
                error: "Email already exists"
            });
        }
    });
    let doctor = await new Doctor(req.body);
    console.log(req.body);
    await doctor.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.status(201).json(result);
    });
};
exports.updateDoctor = (req, res) => {
    let doctor = req.profile;
    console.log(req.body);
    doctor = _.extend(doctor, req.body);
    doctor.updated = Date.now();
    doctor.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(doctor);
    });
};
exports.userPhoto = (req, res, next) => {
    Doctor.findById(req.params.userId, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: err
            })
        }
        if (user.photo) {
            return res.send(user.photo);
        }
        next();
    })
};
exports.deleteDoctor = (req, res, next) => {
    let user = req.profile;
    user.deleteOne((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "Doctor deleted successfully" });
    });
};
