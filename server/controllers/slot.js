const Slot = require('../models/slot');
const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose),
  { ObjectId } = mongoose.Schema;

const slotController = {
  all(req, res) {
    console.log(req.params.doctorID);
    Slot.find({ doctor: { $eq: req.params.doctorID } })
      .exec((err, slots) => res.json(slots))
  },
  create(req, res) {
    var requestBody = req.body;
    console.log(req.body);
    var newSlot = new Slot({
      start_time: requestBody.startTime,
      end_time: requestBody.endTime,
      doctor: requestBody.doctor,
      created_at: Date.now()
    });
    newSlot.save((err, saved) => {
      Slot
        .findOne({ _id: saved._id })
        .exec((err, slot) => res.json(slot));
    })
  },
  delete(req, res) {
    let slot = req.body.slot_id;
    Slot.deleteOne({ _id: slot }, (err, user) => {
      console.log(err);
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({ message: "Slot deleted successfully" });
    });
  },
  findByDate(req, res) {
    var slot_date = req.params.slot_date;
    console.log('slot date: ', slot_date);
    //slot_date = '2017-11-09';

    //Returns all slot with present date
    Slot.find({})
      .where('slot_date').equals(slot_date)
      .exec((err, slots) => res.json(slots));
  }
};

module.exports = slotController;
