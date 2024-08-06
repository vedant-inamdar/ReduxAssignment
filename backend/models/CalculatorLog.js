const mongoose = require("mongoose");

// Define the schema for calculator logs
const CalculatorLogSchema = new mongoose.Schema({
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
});

// Export the model based on the schema
module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);
