const db = require("./database");

// Create tables
const initDatabase = () => {
  // Create products table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT NOT NULL,
      name TEXT NOT NULL,
      count INTEGER NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      weight TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating products table:", err.message);
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
      FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating comments table:", err.message);
      } else {
        console.log("Comments table created successfully");
      }
    }
  );

  // Insert sample data
  insertSampleData();
};

const insertSampleData = () => {
  // Insert sample products
  const sampleProducts = [
    {
      imageUrl: "https://via.placeholder.com/200x200",
      name: "Sample Product 1",
      count: 10,
      width: 200,
      height: 200,
      weight: "200g",
    },
    {
      imageUrl: "https://via.placeholder.com/300x300",
      name: "Sample Product 2",
      count: 5,
      width: 300,
      height: 300,
      weight: "300g",
    },
  ];

  sampleProducts.forEach((product) => {
    db.run(
      `
      INSERT OR IGNORE INTO products (imageUrl, name, count, width, height, weight)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        product.imageUrl,
        product.name,
        product.count,
        product.width,
        product.height,
        product.weight,
      ]
    );
  });

  // Insert sample comments
  const sampleComments = [
    {
      productId: 1,
      description: "Great product!",
      date: "14:00 22.08.2021",
    },
    {
      productId: 1,
      description: "Very satisfied with the quality",
      date: "15:30 22.08.2021",
    },
    {
      productId: 2,
      description: "Excellent service",
      date: "16:00 22.08.2021",
    },
  ];

  sampleComments.forEach((comment) => {
    db.run(
      `
      INSERT OR IGNORE INTO comments (productId, description, date)
      VALUES (?, ?, ?)
    `,
      [comment.productId, comment.description, comment.date]
    );
  });

  console.log("Sample data inserted successfully");
};

// Run initialization
initDatabase();

// Close database connection after initialization
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
  });
}, 1000);
