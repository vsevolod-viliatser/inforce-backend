import path from "path";
import sqlite3 from "sqlite3";

// Database file path
const dbPath = path.join(__dirname, "../../database/products.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

export default db;
