import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";

// Load env variables
dotenv.config();

// App Configuration
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ FIX: CORS issue solved
app.use(
  cors({
    origin: ["http://localhost:8080", "https://My-Finance-dev.vercel.app"],
    credentials: true, // ✅ Cookies को allow करने के लिए
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Debugging के लिए Middleware
app.use((req, res, next) => {
  console.log(`🔍 Request: ${req.method} ${req.path}`);
  console.log(`🍪 Cookies:`, req.cookies);
  next();
});

// ✅ Default Route to check if backend is running
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is running successfully!" });
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server started on PORT ${PORT}!`);
      console.log(`🔗 Frontend: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.log(`❌ Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
