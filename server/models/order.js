const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  people: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  tableOrder: {
    type: String,
    required: true,
  },
  resturantId: {
    type: Schema.Types.ObjectId,
    ref: "resturant",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model('order', OrderSchema);