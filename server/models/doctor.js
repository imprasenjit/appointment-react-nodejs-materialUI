const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;
const { v1: uuidv1 } = require('uuid');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        unique: true,
        type: String,
        trim: true,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    resetPasswordLink: {
        data: String,
        default: ""
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: String,
    about: {
        type: String,
        trim: true
    },
    notificationToken: {
        type: String
    }
});

doctorSchema.virtual('password').set(function (password) {
    //create temp var _password
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    // encrypt password
    console.log(password);
    this.hashed_password = this.encryptPassword(password);
})
    .get(function () {
        return this._password;
    })


//methods
doctorSchema.methods = {

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ""
        }
    }
}



module.exports = mongoose.model("Doctor", doctorSchema);