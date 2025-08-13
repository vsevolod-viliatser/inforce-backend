import * as path from "path";
import { Pool } from "pg";
import * as sqlite3 from "sqlite3";

// Check if we're in production (Render) or development
const isProduction = process.env.NODE_ENV === "production";

let db: any;

if (isProduction) {
  // PostgreSQL for production (Render)
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Test the connection
  db.query("SELECT NOW()", (err: any, res: any) => {
    if (err) {
      console.error("Error connecting to PostgreSQL:", err.message);
    } else {
      console.log("Connected to PostgreSQL database");
    }
  });
} else {
  // SQLite for local development
  const dbPath = path.join(__dirname, "../../database/products.db");
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening SQLite database:", err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  });

  // Enable foreign keys for SQLite
  db.run("PRAGMA foreign_keys = ON");
}

export default db;
export { isProduction };
