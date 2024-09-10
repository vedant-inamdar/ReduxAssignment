const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", logRoutes);

app.get("/", (req, res) => {
  res.send("Hello from the API!");
  logger.info("Served root endpoint");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});
