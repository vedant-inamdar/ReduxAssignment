const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logs/server.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        winston.format.align(),
        winston.format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
    // MongoDB transport
    new winston.transports.MongoDB({
      level: "error",
      db: "mongodb+srv://vedcal:vedcal@cluster0.kuck9xt.mongodb.net/logs?retryWrites=true&w=majority&appName=Cluster0",
      options: {
        useUnifiedTopology: true, // Include this to avoid the warning
      },
      collection: "server_logs",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
