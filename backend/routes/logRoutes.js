const express = require("express");
const math = require("mathjs");
const CalculatorLog = require("../models/CalculatorLog");
const logger = require("../config/logger");

const router = express.Router();

//function handle database operations
const handleDbOperation = (operation) => async (req, res, next) => {
  try {
    await operation(req, res);
  } catch (error) {
    logger.error(`Database operation error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
      output = math.evaluate(expression);
      output = parseFloat(output.toFixed(2)); // Format to 2 decimal places
      isValid = true;
    } catch (err) {
      isValid = false;
      logger.warn(`Invalid expression attempted: ${expression}`);
    }

    const calculatorLog = new CalculatorLog({ expression, isValid, output });
    // console.log(calculatorLog);
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

// latest 10 calculator logs
router.get(
  "/logs",
  handleDbOperation(async (req, res) => {
    const logs = await CalculatorLog.find()
      .sort({ createdOn: -1 })
      .limit(10)
      .exec();
    logger.info("Successfully retrieved logs");
    res.json(logs);
  })
);

module.exports = router;
