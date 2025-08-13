#!/usr/bin/env node

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Ensure database directory exists
const dbDir = path.join(__dirname, "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

const dbPath = path.join(dbDir, "products.db");
console.log(`Initializing database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Create tables
db.serialize(() => {
  // Create products table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      weight TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating products table:", err);
      } else {
        console.log("Products table created successfully");
      }
    }
  );

  // Create comments table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating comments table:", err);
      } else {
        console.log("Comments table created successfully");
      }
    }
  );

  // Insert sample data
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error("Error checking products count:", err);
      return;
    }

    if (row.count === 0) {
      console.log("Inserting sample data...");

      // Insert sample products
      db.run(
        `
        INSERT INTO products (name, imageUrl, count, width, height, weight) VALUES
        ('Sample Product 1', 'https://via.placeholder.com/200x200', 10, 200, 200, '200g'),
        ('Sample Product 2', 'https://via.placeholder.com/300x300', 5, 300, 300, '300g')
      `,
        (err) => {
          if (err) {
            console.error("Error inserting sample products:", err);
          } else {
            console.log("Sample products inserted successfully");
          }
        }
      );

      // Insert sample comments
      db.run(
        `
        INSERT INTO comments (productId, description, date) VALUES
        (1, 'Great product!', '14:00 22.08.2021'),
        (2, 'Excellent service', '16:00 22.08.2021'),
        (1, 'Very satisfied with the quality', '15:30 22.08.2021')
      `,
        (err) => {
          if (err) {
            console.error("Error inserting sample comments:", err);
          } else {
            console.log("Sample comments inserted successfully");
          }
        }
      );
    } else {
      console.log(`Database already contains ${row.count} products`);
    }
  });
});

// Close database after initialization
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database initialization completed successfully");
    }
    process.exit(0);
  });
}, 1000);
