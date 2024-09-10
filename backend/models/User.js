const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 15 },
  lastName: { type: String, minlength: 3, maxlength: 15 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 10, max: 115 },
  homeAddress: { type: String, required: true, minlength: 10, maxlength: 100 },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  logo: { type: String, required: true, minlength: 10, maxlength: 500 },
});

module.exports = mongoose.model("User", userSchema);
