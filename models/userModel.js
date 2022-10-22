const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `A user must have a name`],
  },
  email: {
    type: String,
    required: [true, `A user must have an email`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Please provide a valid email`],
  },
  photo: String,
  password: {
    type: String,
    required: [true, `A user must have a password`],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password`],
    validate: {
      //this only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: `Passwords mismatch`,
    },
  },
});

// Salting in bcrypt - Adds a random string to the password so that two equal passwords do not generate the same hash.
userSchema.pre('save', async function (next) {
  //only run the function if password was actually modified.
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); //Hash the password with cost of 12
  this.passwordConfirm = undefined; //delete passwordConfirm field before sending to db.
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;