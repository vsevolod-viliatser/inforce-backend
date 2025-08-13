import db, { isProduction } from "./database";

const initPostgreSQL = async () => {
  try {
    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        imageUrl TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        size_width INTEGER NOT NULL,
        size_height INTEGER NOT NULL,
        weight VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create comments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        productId INTEGER NOT NULL,
        description TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Insert sample data if tables are empty
    const productsResult = await db.query("SELECT COUNT(*) FROM products");
    if (parseInt(productsResult.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO products (name, imageUrl, count, size_width, size_height, weight) VALUES
        ('Sample Product 1', 'https://via.placeholder.com/200x200', 10, 200, 200, '200g'),
        ('Sample Product 2', 'https://via.placeholder.com/300x300', 5, 300, 300, '300g')
      `);

      await db.query(`
        INSERT INTO comments (productId, description, date) VALUES
        (1, 'Great product!', '14:00 22.08.2021'),
        (2, 'Excellent service', '16:00 22.08.2021'),
        (1, 'Very satisfied with the quality', '15:30 22.08.2021')
      `);

      console.log("Sample data inserted successfully");
    }

    console.log("PostgreSQL database initialized successfully");
  } catch (error) {
    console.error("Error initializing PostgreSQL database:", error);
  }
};

const initSQLite = () => {
  // SQLite initialization (existing code)
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      size_width INTEGER NOT NULL,
      size_height INTEGER NOT NULL,
      weight TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  console.log("SQLite database initialized successfully");
};

if (isProduction) {
  initPostgreSQL();
} else {
  initSQLite();
}
