const express = require("express");
const math = require("mathjs");
const CalculatorLog = require("../models/CalculatorLog");
const logger = require("../config/logger");

const router = express.Router();

// Middleware to handle database operations
const handleDbOperation = (operation) => async (req, res, next) => {
  try {
    await operation(req, res);
  } catch (error) {
    logger.error(`Database operation error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Route to log a new calculator expression
router.post(
  "/logs",
  handleDbOperation(async (req, res) => {
    const { expression } = req.body;

    if (!expression) {
      logger.info("Received an empty expression");
      return res.status(400).json({ message: "Expression is empty" });
    }

    let output = null;
    let isValid = true;

    try {
      // Evaluate the expression
      output = math.evaluate(expression);
      output = parseFloat(output.toFixed(2)); // Format to 2 decimal places
    } catch (err) {
      isValid = false;
      logger.warn(`Invalid expression attempted: ${expression}`);
    }

    // Create a new log entry
    const calculatorLog = new CalculatorLog({ expression, isValid, output });
    await calculatorLog.save();
    logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

    return res.json({
      message: isValid
        ? `Expression evaluated to ${output}`
        : "Invalid expression",
      output: isValid ? output : null,
      isValid,
    });
  })
);

// Route to fetch the latest 10 calculator logs
router.get(
  "/logs",
  handleDbOperation(async (req, res) => {
    const logs = await CalculatorLog.find()
      .sort({ createdOn: -1 }) // Sort by creation date in descending order
      .limit(10) // Limit to the latest 10 entries
      .exec();

    logger.info("Successfully retrieved logs");
    res.json(logs);
  })
);

module.exports = router;
