const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Allows JSON request bodies
app.use(cors()); // Enables cross-origin requests

// Import routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
