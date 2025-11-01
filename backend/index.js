import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/userRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// ✅ Configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Allow frontend URL or fallback
    credentials: true,
  })
);

// ✅ API routes
app.use("/api/auth", authRoutes);

// ✅ Serve React build files (for production)
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// ✅ Handle React Router routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

// ✅ Start server (async/await style)
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
