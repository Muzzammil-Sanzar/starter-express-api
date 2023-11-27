const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResturantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  menuLink: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

module.exports = mongoose.model('resturant', ResturantSchema);