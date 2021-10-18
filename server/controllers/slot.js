const Slot = require('../models/slot');
const mongoose = require('mongoose');
const moment = require('moment');


const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose),
  { ObjectId } = mongoose.Schema;
const slotController = {
  all(req, res) {
    console.log(req.params.doctorID);
    Slot.find({ doctor: { $eq: req.params.doctorID } }).sort({ start_time: 1 })
      .exec((err, slots) => res.json(slots))
  },
  async create(req, res) {
    var requestBody = req.body;
    console.log(requestBody);
    const slotsArray = [];
    await Slot.deleteMany({ doctor: { $eq: requestBody.doctor } }).exec((err, slots) => {

      let stime = moment(requestBody.startTime, "HHmm").format('HH:mm');
      const etime = moment(requestBody.endTime, "HHmm").format('HHmm');
      let gtime = 0;
      let looptime = 0;
      while (etime > looptime) {
        // console.log("stime", stime);
        // console.log("looptime", looptime);
        looptime = moment(stime, "HH:mm").add(requestBody.duration, 'minutes').format('HHmm');
        gtime = moment(stime, "HHmm").add(requestBody.duration, 'minutes').format('HH:mm');
        slotsArray.push({ "doctor": requestBody.doctor, "created_at": Date.now(), "start_time": moment(stime, "HHmm").format("HHmm"), "end_time": looptime });
        stime = gtime;
      }
      // console.log("slotsArray", slotsArray);
      Slot.insertMany(slotsArray).then(function () {
        console.log("Data inserted");// Success
        res.json({ success: true, slots: slotsArray });
      }).catch(function (error) {
        console.log(error)      // Failure
      });
    });

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
