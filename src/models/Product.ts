import db, { isProduction } from "../config/database";
import { Product, ProductCreate } from "../types";

interface ProductRow {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  width: number;
  height: number;
  weight: string;
  comment_id?: number;
  description?: string;
  date?: string;
}

export class ProductModel {
  // Get all products with their comments
  static async getAll(): Promise<Product[]> {
    if (isProduction) {
      // PostgreSQL implementation
      try {
        const query = `
          SELECT 
            p.id,
            p.imageUrl,
            p.name,
            p.count,
            p.size_width as width,
            p.size_height as height,
            p.weight,
            c.id as comment_id,
            c.description,
            c.date
          FROM products p
          LEFT JOIN comments c ON p.id = c.productId
          ORDER BY p.id, c.id
        `;

        const result = await db.query(query);
        const rows = result.rows;

        // Group products with their comments
        const productsMap = new Map<number, Product>();

        rows.forEach((row: ProductRow) => {
          if (!productsMap.has(row.id)) {
            productsMap.set(row.id, {
              id: row.id,
              imageUrl: row.imageUrl,
              name: row.name,
              count: row.count,
              size: {
                width: row.width,
                height: row.height,
              },
              weight: row.weight,
              comments: [],
            });
          }

          if (row.comment_id) {
            const product = productsMap.get(row.id)!;
            product.comments!.push({
              id: row.comment_id,
              productId: row.id,
              description: row.description!,
              date: row.date!,
            });
          }
        });

        return Array.from(productsMap.values());
      } catch (error) {
        console.error("PostgreSQL error:", error);
        throw error;
      }
    } else {
      // SQLite implementation
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            p.id,
            p.imageUrl,
            p.name,
            p.count,
            p.width,
            p.height,
            p.weight,
            c.id as comment_id,
            c.description,
            c.date
          FROM products p
          LEFT JOIN comments c ON p.id = c.productId
          ORDER BY p.id, c.id
        `;

        db.all(query, [], (err: Error | null, rows: ProductRow[]) => {
          if (err) {
            reject(err);
            return;
          }

          // Group products with their comments
          const productsMap = new Map<number, Product>();

          rows.forEach((row: ProductRow) => {
            if (!productsMap.has(row.id)) {
              productsMap.set(row.id, {
                id: row.id,
                imageUrl: row.imageUrl,
                name: row.name,
                count: row.count,
                size: {
                  width: row.width,
                  height: row.height,
                },
                weight: row.weight,
                comments: [],
              });
            }

            if (row.comment_id) {
              const product = productsMap.get(row.id)!;
              product.comments!.push({
                id: row.comment_id,
                productId: row.id,
                description: row.description!,
                date: row.date!,
              });
            }
          });

          resolve(Array.from(productsMap.values()));
        });
      });
    }
  }

  // Get product by ID with comments
  static async getById(id: number): Promise<Product | null> {
    if (isProduction) {
      // PostgreSQL implementation
      try {
        const query = `
          SELECT 
            p.id,
            p.imageUrl,
            p.name,
            p.count,
            p.size_width as width,
            p.size_height as height,
            p.weight,
            c.id as comment_id,
            c.description,
            c.date
          FROM products p
          LEFT JOIN comments c ON p.id = c.productId
          WHERE p.id = $1
          ORDER BY c.id
        `;

        const result = await db.query(query, [id]);
        const rows = result.rows;

        if (rows.length === 0) {
          return null;
        }

        const product: Product = {
          id: rows[0].id,
          imageUrl: rows[0].imageUrl,
          name: rows[0].name,
          count: rows[0].count,
          size: {
            width: rows[0].width,
            height: rows[0].height,
          },
          weight: rows[0].weight,
          comments: [],
        };

        rows.forEach((row: ProductRow) => {
          if (row.comment_id) {
            product.comments!.push({
              id: row.comment_id,
              productId: row.id,
              description: row.description!,
              date: row.date!,
            });
          }
        });

        return product;
      } catch (error) {
        console.error("PostgreSQL error:", error);
        throw error;
      }
    } else {
      // SQLite implementation
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            p.id,
            p.imageUrl,
            p.name,
            p.count,
            p.width,
            p.height,
            p.weight,
            c.id as comment_id,
            c.description,
            c.date
          FROM products p
          LEFT JOIN comments c ON p.id = c.productId
          WHERE p.id = ?
          ORDER BY c.id
        `;

        db.all(query, [id], (err: Error | null, rows: ProductRow[]) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows.length === 0) {
            resolve(null);
            return;
          }

          const product: Product = {
            id: rows[0].id,
            imageUrl: rows[0].imageUrl,
            name: rows[0].name,
            count: rows[0].count,
            size: {
              width: rows[0].width,
              height: rows[0].height,
            },
            weight: rows[0].weight,
            comments: [],
          };

          rows.forEach((row: ProductRow) => {
            if (row.comment_id) {
              product.comments!.push({
                id: row.comment_id,
                productId: row.id,
                description: row.description!,
                date: row.date!,
              });
            }
          });

          resolve(product);
        });
      });
    }
  }

  // Create new product
  static async create(productData: ProductCreate): Promise<Product> {
    if (isProduction) {
      // PostgreSQL implementation
      try {
        const query = `
          INSERT INTO products (imageUrl, name, count, size_width, size_height, weight)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

        const result = await db.query(query, [
          productData.imageUrl,
          productData.name,
          productData.count,
          productData.width,
          productData.height,
          productData.weight,
        ]);

        const newProduct: Product = {
          id: result.rows[0].id,
          imageUrl: productData.imageUrl,
          name: productData.name,
          count: productData.count,
          size: {
            width: productData.width,
            height: productData.height,
          },
          weight: productData.weight,
          comments: [],
        };

        return newProduct;
      } catch (error) {
        console.error("PostgreSQL error:", error);
        throw error;
      }
    } else {
      // SQLite implementation
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO products (imageUrl, name, count, width, height, weight)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
          query,
          [
            productData.imageUrl,
            productData.name,
            productData.count,
            productData.width,
            productData.height,
            productData.weight,
          ],
          function (this: { lastID: number }, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }

            const newProduct: Product = {
              id: this.lastID,
              imageUrl: productData.imageUrl,
              name: productData.name,
              count: productData.count,
              size: {
                width: productData.width,
                height: productData.height,
              },
              weight: productData.weight,
              comments: [],
            };

            resolve(newProduct);
          }
        );
      });
    }
  }

  // Update product
  static async update(
    id: number,
    productData: Partial<ProductCreate>
  ): Promise<boolean> {
    if (isProduction) {
      // PostgreSQL implementation
      try {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (productData.imageUrl !== undefined) {
          fields.push(`imageUrl = $${paramCount++}`);
          values.push(productData.imageUrl);
        }
        if (productData.name !== undefined) {
          fields.push(`name = $${paramCount++}`);
          values.push(productData.name);
        }
        if (productData.count !== undefined) {
          fields.push(`count = $${paramCount++}`);
          values.push(productData.count);
        }
        if (productData.width !== undefined) {
          fields.push(`size_width = $${paramCount++}`);
          values.push(productData.width);
        }
        if (productData.height !== undefined) {
          fields.push(`size_height = $${paramCount++}`);
          values.push(productData.height);
        }
        if (productData.weight !== undefined) {
          fields.push(`weight = $${paramCount++}`);
          values.push(productData.weight);
        }

        if (fields.length === 0) {
          return false;
        }

        values.push(id);
        const query = `UPDATE products SET ${fields.join(
          ", "
        )} WHERE id = $${paramCount}`;

        const result = await db.query(query, values);
        return result.rowCount > 0;
      } catch (error) {
        console.error("PostgreSQL error:", error);
        throw error;
      }
    } else {
      // SQLite implementation
      return new Promise((resolve, reject) => {
        const fields: string[] = [];
        const values: any[] = [];

        if (productData.imageUrl !== undefined) {
          fields.push("imageUrl = ?");
          values.push(productData.imageUrl);
        }
        if (productData.name !== undefined) {
          fields.push("name = ?");
          values.push(productData.name);
        }
        if (productData.count !== undefined) {
          fields.push("count = ?");
          values.push(productData.count);
        }
        if (productData.width !== undefined) {
          fields.push("width = ?");
          values.push(productData.width);
        }
        if (productData.height !== undefined) {
          fields.push("height = ?");
          values.push(productData.height);
        }
        if (productData.weight !== undefined) {
          fields.push("weight = ?");
          values.push(productData.weight);
        }

        if (fields.length === 0) {
          resolve(false);
          return;
        }

        values.push(id);
        const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

        db.run(
          query,
          values,
          function (this: { changes: number }, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.changes > 0);
          }
        );
      });
    }
  }

  // Delete product
  static async delete(id: number): Promise<boolean> {
    if (isProduction) {
      // PostgreSQL implementation
      try {
        const query = "DELETE FROM products WHERE id = $1";
        const result = await db.query(query, [id]);
        return result.rowCount > 0;
      } catch (error) {
        console.error("PostgreSQL error:", error);
        throw error;
      }
    } else {
      // SQLite implementation
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM products WHERE id = ?";

        db.run(
          query,
          [id],
          function (this: { changes: number }, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }
            resolve(this.changes > 0);
          }
        );
      });
    }
  }
}
