const mongoose = require("mongoose");
const logger = require("./logger");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://vedcal:vedcal@cluster0.kuck9xt.mongodb.net/logs?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true, // Reintroduce this option
    });
    console.log("Connected to MongoDB");
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
