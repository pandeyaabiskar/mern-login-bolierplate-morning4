const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  //Schema
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  }, 
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be at least 6 characters long"]
  }
})

//Runs before data is saved in database
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

const User = new mongoose.model('User', userSchema);

module.exports = User;