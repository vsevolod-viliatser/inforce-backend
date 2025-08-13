import db, { isProduction } from "./database";

const initSQLite = () => {
  return new Promise<void>((resolve, reject) => {
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
          reject(err);
          return;
        }
        console.log("Products table created/verified successfully");
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
          reject(err);
          return;
        }
        console.log("Comments table created/verified successfully");
      }
    );

    // For production (in-memory database), always insert sample data since it will be lost on restart
    // For development, only insert if tables are empty
    const shouldInsertSampleData = () => {
      if (isProduction) {
        return true; // Always insert for in-memory database
      }

      return new Promise<boolean>((resolve) => {
        db.get("SELECT COUNT(*) as count FROM products", (err, row: any) => {
          if (err) {
            console.error("Error checking products count:", err);
            resolve(false);
            return;
          }
          resolve(row.count === 0);
        });
      });
    };

    const insertSampleData = async () => {
      const shouldInsert = await shouldInsertSampleData();

      if (shouldInsert) {
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
        console.log(
          "Database already contains data, skipping sample data insertion"
        );
      }
    };

    // Wait for table creation to complete, then insert sample data
    setTimeout(async () => {
      await insertSampleData();
      resolve();
    }, 100);
  });
};

// Initialize database based on environment
const initDatabase = async () => {
  try {
    if (isProduction) {
      console.log("Initializing SQLite in-memory database for production...");
    } else {
      console.log("Initializing SQLite file-based database for development...");
    }

    await initSQLite();
    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// Auto-initialize when this module is imported
initDatabase().catch(console.error);

export default initDatabase;
