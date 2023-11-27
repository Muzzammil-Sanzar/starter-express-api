const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
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
  zipCode: {
    type: Number,
    required: true,
  },
  joinedOn: {
    type: Date,
    default: Date.now()
  },
  image: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// fire a function before doc saved to db
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
