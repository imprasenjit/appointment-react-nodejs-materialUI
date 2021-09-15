const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose),
  { ObjectId } = mongoose.Schema;


const slotSchema = new Schema({
  start_time: String,
  end_time: String,
  doctor: { type: ObjectId, ref: 'Doctor' },
  created_at: Date
});

const Slot = model('Slot', slotSchema);

module.exports = Slot;
