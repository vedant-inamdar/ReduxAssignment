const mongoose = require("mongoose");

const CalculatorLogSchema = new mongoose.Schema({
  expression: { type: String, required: true },
  isValid: { type: Boolean, required: true },
  output: { type: Number, required: false },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CalculatorLog", CalculatorLogSchema);
