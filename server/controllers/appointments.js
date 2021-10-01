
const Appointment = require('../models/appointment');
const Slot = require('../models/slot');
const moment = require('moment');
// const Nexmo = require("nexmo");

const appointmentController = {
  all(req, res) {
    // Returns all appointments
    Appointment.find({})
      .populate("slots", "_id slot_time slot_date").exec((err, appointments) => res.json(appointments));
  },
  async getAvailableSlots(req, res) {
    const slots = await Slot.find({ doctor: { $eq: req.body.doctor } }).sort({ start_time: 1 })
      .exec();
    const searchDate = moment(req.body.appointmentDate).format('YYYY-MM-DD');
    const appointments = await Appointment.find({
      doctor: { $eq: req.body.doctor },
      appointment_date: {
        $eq: new Date(searchDate)
      }
    }).exec();
    if (appointments.length > 0) {
      let indexes = [];
      // const arr = slots;
      const arr = slots.map((item, i) => {
        return {
          start_time: item.start_time,
          end_time: item.end_time,
          status: "available"
        }
      });
      appointments.forEach((appointment) => {
        slots.forEach((o, i) => {
          let s_time = `${o.start_time}-${o.end_time}`;
          if (s_time === appointment.slot_time) {
            indexes.push(i);
            return true;
          }
        });
      });
      indexes.map((i) => {
        arr[i].status = "notavailable";
      });
      console.log("slots", arr);
      res.json(arr);

    } else {
      // console.log("slots", slots);
      const slotUpdated = slots.map((item) => {
        // return { ...item, status: "available" }
        return {
          _id: item._id,
          start_time: item.start_time,
          end_time: item.end_time,
          doctor: item.doctor,
          status: "available",
          appointmentDate: req.body.appointmentDate
        }
      })
      res.json(slotUpdated);
    }

  },
  create(req, res) {
    var requestBody = req.body;
    // Creates a new record from a submitted form
    console.log(requestBody);
    var newappointment = new Appointment({
      name: requestBody.name,
      email: requestBody.email,
      phone: requestBody.phone,
      doctor: requestBody.doctor,
      status: 'active',
      appointment_date: new Date(req.body.slot_date),
      slot_time: requestBody.slot_time,
    });

    newappointment.save((err, saved) => {
      if (err) {
        console.log(err)
      }
      Appointment.find({ _id: saved._id })
        .populate("slots")
        .exec((err, appointment) => res.json(appointment));
    });
  },
  cancel(req, res) {
    let appointment = req.body.appointment_id;
    Appointment.deleteOne({ _id: appointment }, (err, user) => {
      console.log(err);
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({ message: "Appointment canceled successfully" });
    });
  }
};

module.exports = appointmentController;
