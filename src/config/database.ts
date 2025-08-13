import * as fs from "fs";
import * as path from "path";
import * as sqlite3 from "sqlite3";

// For now, use SQLite in both development and production to avoid database setup issues
const isProduction = process.env.NODE_ENV === "production";

// Ensure database directory exists
const dbDir = path.join(process.cwd(), "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

const dbPath = path.join(dbDir, "products.db");
console.log(`Database path: ${dbPath}`);

let db: sqlite3.Database;

// Use SQLite for both development and production
db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening SQLite database:", err.message);
    console.error("Database path:", dbPath);
    console.error("Current working directory:", process.cwd());
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Enable foreign keys for SQLite
db.run("PRAGMA foreign_keys = ON");

export default db;
export { isProduction };
