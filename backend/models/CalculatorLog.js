// const mongoose = require("mongoose");

// // Define the schema for calculator logs
// const CalculatorLogSchema = new mongoose.Schema({
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
// });

// // Export the model based on the schema
// module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);

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
// });

// // Export the model based on the schema
// module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);

// const sequenceSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 0 },
// });

// module.exports = mongoose.model("Sequence", sequenceSchema);

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
});

// Export the model based on the schema
module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);
