const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const logRoutes = require("./routes/logRoutes");

const app = express();

// Initialize database connection
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Route handlers
app.use("/api", logRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello from the Calculator Log API!");
  logger.info("Served root endpoint");
});

// Server configuration
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});
