import db, { isProduction } from "./database";

const initSQLite = () => {
  return new Promise<void>((resolve, reject) => {
    console.log("Starting database initialization...");

    // Create products table
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        weight TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
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
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
      )`,
      (err) => {
        if (err) {
          console.error("Error creating comments table:", err);
          reject(err);
          return;
        }
        console.log("Comments table created/verified successfully");
      }
    );

    // Check if we need to insert sample data
    const checkAndInsertSampleData = () => {
      db.get("SELECT COUNT(*) as count FROM products", (err, row: any) => {
        if (err) {
          console.error("Error checking products count:", err);
          resolve(); // Continue anyway
          return;
        }

        if (row.count === 0) {
          console.log("No products found, inserting sample data...");
          insertSampleData();
        } else {
          console.log(
            `Database already contains ${row.count} products, skipping sample data`
          );
          resolve();
        }
      });
    };

    const insertSampleData = () => {
      // Insert products one by one, then comments
      db.run(
        `INSERT INTO products (name, imageUrl, count, width, height, weight) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          "Sample Product 1",
          "https://via.placeholder.com/200x200",
          10,
          200,
          200,
          "200g",
        ],
        function (err) {
          if (err) {
            console.error("Error inserting first product:", err);
            resolve();
            return;
          }

          const product1Id = this.lastID;
          console.log(`Inserted first product with ID: ${product1Id}`);

          // Insert second product
          db.run(
            `INSERT INTO products (name, imageUrl, count, width, height, weight) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              "Sample Product 2",
              "https://via.placeholder.com/300x300",
              5,
              300,
              300,
              "300g",
            ],
            function (err) {
              if (err) {
                console.error("Error inserting second product:", err);
                resolve();
                return;
              }

              const product2Id = this.lastID;
              console.log(`Inserted second product with ID: ${product2Id}`);

              // Now insert comments using the actual product IDs
              const insertComment = (
                productId: number,
                description: string,
                date: string
              ) => {
                return new Promise<void>((resolveComment) => {
                  db.run(
                    `INSERT INTO comments (productId, description, date) VALUES (?, ?, ?)`,
                    [productId, description, date],
                    (err) => {
                      if (err) {
                        console.error(
                          `Error inserting comment for product ${productId}:`,
                          err
                        );
                      } else {
                        console.log(
                          `Inserted comment for product ${productId}: ${description}`
                        );
                      }
                      resolveComment();
                    }
                  );
                });
              };

              // Insert all comments
              Promise.all([
                insertComment(product1Id, "Great product!", "14:00 22.08.2021"),
                insertComment(
                  product2Id,
                  "Excellent service",
                  "16:00 22.08.2021"
                ),
                insertComment(
                  product1Id,
                  "Very satisfied with the quality",
                  "15:30 22.08.2021"
                ),
              ])
                .then(() => {
                  console.log("Sample data insertion completed successfully");
                  resolve();
                })
                .catch((error) => {
                  console.error("Error during comment insertion:", error);
                  resolve();
                });
            }
          );
        }
      );
    };

    // Wait for tables to be created, then check for sample data
    setTimeout(() => {
      checkAndInsertSampleData();
    }, 200);
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
    // Don't throw error, just log it
    console.log("Continuing with server startup...");
  }
};

// Auto-initialize when this module is imported
initDatabase().catch((error) => {
  console.error("Database initialization error:", error);
  console.log("Continuing with server startup...");
});

export default initDatabase;
