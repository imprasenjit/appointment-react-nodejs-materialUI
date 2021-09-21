const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    model = mongoose.model.bind(mongoose),
    { ObjectId } = mongoose.Schema;

const appointmentSchema = new Schema({
    id: ObjectId,
    name: String,
    email: String,
    doctor: { type: ObjectId, ref: "doctor" },
    status: String,
    phone: Number,
    slot_time: String,
    // slot_end_time: String,
    appointment_date: Date,
    created_at: Date
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;