// const mongoose = require("mongoose");

// // Define the schema for calculator logs
// const CalculatorLogSchema = new mongoose.Schema({
//   _id: { type: Number, required: true },
//   expression: {
//     type: String,
//     required: true, // Expression is mandatory
//   },
//   isValid: {
//     type: Boolean,
//     required: true, // Validity status is mandatory
//   },
//   output: {
//     type: Number,
//     required: false, // Output can be optional
//   },
//   createdOn: {
//     type: Date,
//     default: Date.now, // Automatically set the current date
//   },
//   sequenceNumber: {
//     type: Number,
//     required: true, // Sequence number is mandatory
//   },
// });

// // Export the model based on the schema
// module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);

//User specific-logs

const mongoose = require("mongoose");

// Define the schema for calculator logs
const CalculatorLogSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  expression: {
    type: String,
    required: true, // Expression is mandatory
  },
  isValid: {
    type: Boolean,
    required: true, // Validity status is mandatory
  },
  output: {
    type: Number,
    required: false, // Output can be optional
  },
  createdOn: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
  sequenceNumber: {
    type: Number,
    required: true, // Sequence number is mandatory
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // User reference is mandatory
  },
});

// Export the model based on the schema
module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);
