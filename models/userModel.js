const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, `A user must have a password`],
    minlength: 8,
    select: false, //to not show up in any queries
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Salting in bcrypt - Adds a random string to the password so that two equal passwords do not generate the same hash.
userSchema.pre('save', async function (next) {
  //only run the function if password was actually modified.
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); //Hash the password with cost of 12
  this.passwordConfirm = undefined; //delete passwordConfirm field before sending to db.
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}; //Instance method---available on all documents

//Check if password changed after token issued
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    //To convert to seconds:
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  //False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
