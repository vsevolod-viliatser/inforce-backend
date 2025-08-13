import * as path from "path";
import * as sqlite3 from "sqlite3";

// For now, use SQLite in both development and production to avoid database setup issues
const isProduction = process.env.NODE_ENV === "production";

let db: sqlite3.Database;

// Use SQLite for both development and production
const dbPath = isProduction
  ? path.join(process.cwd(), "database", "products.db")
  : path.join(process.cwd(), "database", "products.db");

db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening SQLite database:", err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Enable foreign keys for SQLite
db.run("PRAGMA foreign_keys = ON");

export default db;
export { isProduction };
