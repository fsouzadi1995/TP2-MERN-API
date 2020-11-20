const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { first: String, last: String },
  adress: { street: String, number: Number, floor: Number, apartment: String },
  phone: String,
  email: String,
  imagePatch: String,
  isAdmin: Boolean,
  checkIn: Number,
  checkOut: Number,
  secret: String,
  institutionId: String,
});

module.exports = mongoose.model('User', userSchema);
