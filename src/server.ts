import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || "development";

console.log(`Starting server in ${NODE_ENV} mode`);
console.log(`Server will run on port ${PORT}`);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    environment: NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Database connection test endpoint
app.get("/db-test", async (req, res) => {
  try {
    const db = await import("./config/database");
    if (db.isProduction) {
      // Test PostgreSQL connection
      const result = await db.default.query("SELECT NOW() as current_time");
      res.json({
        status: "OK",
        database: "PostgreSQL",
        current_time: result.rows[0].current_time,
      });
    } else {
      // Test SQLite connection
      res.json({
        status: "OK",
        database: "SQLite",
        message: "SQLite connection established",
      });
    }
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`💬 Comments API: http://localhost:${PORT}/api/comments`);
});

export default app;
