// const express = require("express");
// const math = require("mathjs");
// const CalculatorLog = require("../models/CalculatorLog");
// const logger = require("../config/logger");

// const router = express.Router();

// // Middleware to handle database operations with error handling
// const handleDbOperation = (operation) => async (req, res, next) => {
//   try {
//     await operation(req, res);
//   } catch (error) {
//     // Log error details and respond with a 500 Internal Server Error status
//     logger.error(`Database operation error: ${error.message}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Route to log a new calculator expression
// router.post(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const { expression } = req.body;

//     // Check if the expression is provided
//     if (!expression) {
//       logger.info("Received an empty expression");
//       return res.status(400).json({ message: "Expression is empty" });
//     }

//     let output = null;
//     let isValid = true;

//     try {
//       // Evaluate the mathematical expression
//       output = math.evaluate(expression);
//       output = parseFloat(output.toFixed(2)); // Format output to 2 decimal places
//     } catch (err) {
//       // If evaluation fails, mark as invalid
//       isValid = false;
//       logger.warn(`Invalid expression attempted: ${expression}`);
//     }

//     // Create a new log entry in the database
//     const calculatorLog = new CalculatorLog({ expression, isValid, output });
//     await calculatorLog.save();
//     logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

//     // Respond with the result of the expression or an error message
//     return res.json({
//       message: isValid
//         ? `Expression evaluated to ${output}`
//         : "Invalid expression",
//       output: isValid ? output : null,
//       isValid,
//     });
//   })
// );

// // Route to fetch calculator logs with pagination
// router.get(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 logs per page if not specified

//     // Retrieve logs from the database with pagination and sorting
//     const logs = await CalculatorLog.find()
//       .sort({ createdOn: -1 }) // Sort by creation date in descending order
//       .skip((page - 1) * limit) // Skip logs for previous pages
//       .limit(limit) // Limit the number of logs returned
//       .exec();

//     // Get the total count of logs
//     const totalLogs = await CalculatorLog.countDocuments().exec();

//     logger.info("Successfully retrieved logs");
//     // Respond with the logs, total count, current page, and total number of pages
//     res.json({
//       logs,
//       total: totalLogs,
//       page,
//       pages: Math.ceil(totalLogs / limit), // Calculate total number of pages
//     });
//   })
// );

// // Route to delete calculator logs by an array of IDs
// router.delete(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const { ids } = req.body;

//     // Check if the array of IDs is provided and not empty
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: "No IDs provided for deletion" });
//     }

//     try {
//       // Delete logs from the database where the ID matches any of the provided IDs
//       await CalculatorLog.deleteMany({ _id: { $in: ids } });
//       logger.info(`Deleted logs with IDs: ${ids.join(", ")}`);
//       res.json({ message: "Logs deleted successfully" });
//     } catch (error) {
//       // Log error details and respond with a 500 Internal Server Error status
//       logger.error(`Error deleting logs: ${error.message}`);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   })
// );

// module.exports = router;

// const express = require("express");
// const math = require("mathjs");
// const CalculatorLog = require("../models/CalculatorLog");
// const logger = require("../config/logger");
// const Sequence = require("../models/CalculatorLog");

// const router = express.Router();

// // Middleware to handle database operations with error handling
// const handleDbOperation = (operation) => async (req, res, next) => {
//   try {
//     await operation(req, res);
//   } catch (error) {
//     // Log error details and respond with a 500 Internal Server Error status
//     logger.error(`Database operation error: ${error.message}`);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getNextSequenceValue = async (sequenceName) => {
//   const sequence = await Sequence.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );
//   return sequence.sequence_value;
// };

// // Route to log a new calculator expression
// router.post(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const { expression } = req.body;

//     // Check if the expression is provided
//     if (!expression) {
//       logger.info("Received an empty expression");
//       return res.status(400).json({ message: "Expression is empty" });
//     }

//     let output = null;
//     let isValid = true;

//     try {
//       // Evaluate the mathematical expression
//       output = math.evaluate(expression);
//       output = parseFloat(output.toFixed(2)); // Format output to 2 decimal places
//     } catch (err) {
//       // If evaluation fails, mark as invalid
//       isValid = false;
//       logger.warn(`Invalid expression attempted: ${expression}`);
//     }

//     const nextId = await getNextSequenceValue("logId");
//     // Create a new log entry in the database
//     const calculatorLog = new CalculatorLog({ expression, isValid, output });
//     await calculatorLog.save();
//     logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

//     // Respond with the result of the expression or an error message
//     return res.json({
//       message: isValid
//         ? `Expression evaluated to ${output}`
//         : "Invalid expression",
//       output: isValid ? output : null,
//       isValid,
//     });
//   })
// );

// // Route to fetch calculator logs with pagination
// router.get(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 logs per page if not specified

//     // Retrieve logs from the database with pagination and sorting
//     const logs = await CalculatorLog.find()
//       .sort({ createdOn: -1 }) // Sort by creation date in descending order
//       .skip((page - 1) * limit) // Skip logs for previous pages
//       .limit(limit) // Limit the number of logs returned
//       .exec();

//     // Get the total count of logs
//     const totalLogs = await CalculatorLog.countDocuments().exec();

//     logger.info("Successfully retrieved logs");
//     // Respond with the logs, total count, current page, and total number of pages
//     res.json({
//       logs,
//       total: totalLogs,
//       page,
//       pages: Math.ceil(totalLogs / limit), // Calculate total number of pages
//     });
//   })
// );

// // Route to delete calculator logs by an array of IDs
// router.delete(
//   "/logs",
//   handleDbOperation(async (req, res) => {
//     const { ids } = req.body;

//     // Check if the array of IDs is provided and not empty
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: "No IDs provided for deletion" });
//     }

//     try {
//       // Delete logs from the database where the ID matches any of the provided IDs
//       await CalculatorLog.deleteMany({ _id: { $in: ids } });
//       logger.info(`Deleted logs with IDs: ${ids.join(", ")}`);
//       res.json({ message: "Logs deleted successfully" });
//     } catch (error) {
//       // Log error details and respond with a 500 Internal Server Error status
//       logger.error(`Error deleting logs: ${error.message}`);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   })
// );

// module.exports = router;

const express = require("express");
const math = require("mathjs");
const CalculatorLog = require("../models/CalculatorLog");
const logger = require("../config/logger");
const Sequence = require("../models/Sequence");

const router = express.Router();

// Middleware to handle database operations with error handling
const handleDbOperation = (operation) => async (req, res, next) => {
  try {
    await operation(req, res);
  } catch (error) {
    // Log error details and respond with a 500 Internal Server Error status
    logger.error(`Database operation error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNextSequenceValue = async (sequenceName) => {
  const sequence = await Sequence.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequence.sequence_value;
};

// Route to log a new calculator expression
router.post(
  "/logs",
  handleDbOperation(async (req, res) => {
    const { expression } = req.body;

    // Check if the expression is provided
    if (!expression) {
      logger.info("Received an empty expression");
      return res.status(400).json({ message: "Expression is empty" });
    }

    let output = null;
    let isValid = true;

    try {
      // Evaluate the mathematical expression
      output = math.evaluate(expression);
      output = parseFloat(output.toFixed(2)); // Format output to 2 decimal places
    } catch (err) {
      // If evaluation fails, mark as invalid
      isValid = false;
      logger.warn(`Invalid expression attempted: ${expression}`);
    }

    const nextId = await getNextSequenceValue("logId");
    const sequenceNumber = await getNextSequenceValue("sequenceNumber");

    // Create a new log entry in the database
    const calculatorLog = new CalculatorLog({
      _id: nextId,
      expression,
      isValid,
      output,
      sequenceNumber,
    });
    await calculatorLog.save();
    logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

    // Respond with the result of the expression or an error message
    return res.json({
      message: isValid
        ? `Expression evaluated to ${output}`
        : "Invalid expression",
      output: isValid ? output : null,
      isValid,
    });
  })
);

// Route to fetch calculator logs with pagination
router.get(
  "/logs",
  handleDbOperation(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 logs per page if not specified

    // Retrieve logs from the database with pagination and sorting
    const logs = await CalculatorLog.find()
      .sort({ createdOn: -1 }) // Sort by creation date in descending order
      .skip((page - 1) * limit) // Skip logs for previous pages
      .limit(limit) // Limit the number of logs returned
      .exec();

    // Get the total count of logs
    const totalLogs = await CalculatorLog.countDocuments().exec();

    logger.info("Successfully retrieved logs");
    // Respond with the logs, total count, current page, and total number of pages
    res.json({
      logs,
      total: totalLogs,
      page,
      pages: Math.ceil(totalLogs / limit), // Calculate total number of pages
    });
  })
);

// Route to delete calculator logs by an array of IDs
router.delete(
  "/logs",
  handleDbOperation(async (req, res) => {
    const { ids } = req.body;

    // Check if the array of IDs is provided and not empty
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided for deletion" });
    }

    try {
      // Delete logs from the database where the ID matches any of the provided IDs
      await CalculatorLog.deleteMany({ _id: { $in: ids } });
      logger.info(`Deleted logs with IDs: ${ids.join(", ")}`);
      res.json({ message: "Logs deleted successfully" });
    } catch (error) {
      // Log error details and respond with a 500 Internal Server Error status
      logger.error(`Error deleting logs: ${error.message}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

module.exports = router;
