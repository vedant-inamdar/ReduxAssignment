const winston = require("winston");
require("winston-mongodb");

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Set the default log level to 'info'
  transports: [
    // File transport for logging to local files
    new winston.transports.File({
      filename: "logs/server.log", // Log file location
      format: winston.format.combine(
        winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }), // Timestamp format
        winston.format.align(), // Align log output
        winston.format.printf(
          (info) => `${info.level}: ${info.timestamp}: ${info.message}` // Custom log format
        )
      ),
    }),
    // MongoDB transport for logging to MongoDB
    new winston.transports.MongoDB({
      level: "error", // Log level for MongoDB transport
      db: "mongodb+srv://vedcal:vedcal@cluster0.kuck9xt.mongodb.net/logs?retryWrites=true&w=majority&appName=Cluster0", // MongoDB URI
      options: {
        useUnifiedTopology: true, // Ensure unified topology to avoid warnings
      },
      collection: "server_logs", // MongoDB collection name
      format: winston.format.combine(
        winston.format.timestamp(), // Timestamp for MongoDB logs
        winston.format.json() // JSON format for MongoDB logs
      ),
    }),
  ],
});

module.exports = logger;
