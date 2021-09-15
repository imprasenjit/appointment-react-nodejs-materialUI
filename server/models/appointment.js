const mongoose = require('mongoose');

const Schema = mongoose.Schema,
    model = mongoose.model.bind(mongoose),
    { ObjectId } = mongoose.Schema;

const appointmentSchema = new Schema({
    id: ObjectId,
    name: String,
    email: String,
    doctor: String,
    status: String,
    phone: Number,
    slots: { type: ObjectId, ref: 'Slot' },
    created_at: Date
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;