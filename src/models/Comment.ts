import db from "../config/database";
import { Comment, CommentCreate } from "../types";

export class CommentModel {
  // Get all comments
  static async getAll(): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM comments ORDER BY id";

      db.all(query, [], (err: Error | null, rows: Comment[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Get comment by ID
  static async getById(id: number): Promise<Comment | null> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM comments WHERE id = ?";

      db.get(query, [id], (err: Error | null, row: Comment) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row || null);
      });
    });
  }

  // Get comments by product ID
  static async getByProductId(productId: number): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM comments WHERE productId = ? ORDER BY id";

      db.all(query, [productId], (err: Error | null, rows: Comment[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Create new comment
  static async create(commentData: CommentCreate): Promise<Comment> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO comments (productId, description, date)
        VALUES (?, ?, ?)
      `;

      db.run(
        query,
        [commentData.productId, commentData.description, commentData.date],
        function (this: { lastID: number }, err: Error | null) {
          if (err) {
            reject(err);
            return;
          }

          const newComment: Comment = {
            id: this.lastID,
            productId: commentData.productId,
            description: commentData.description,
            date: commentData.date,
          };

          resolve(newComment);
        }
      );
    });
  }

  // Update comment
  static async update(
    id: number,
    commentData: Partial<CommentCreate>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      if (commentData.productId !== undefined) {
        fields.push("productId = ?");
        values.push(commentData.productId);
      }
      if (commentData.description !== undefined) {
        fields.push("description = ?");
        values.push(commentData.description);
      }
      if (commentData.date !== undefined) {
        fields.push("date = ?");
        values.push(commentData.date);
      }

      if (fields.length === 0) {
        resolve(false);
        return;
      }

      values.push(id);
      const query = `UPDATE comments SET ${fields.join(", ")} WHERE id = ?`;

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

  // Delete comment
  static async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM comments WHERE id = ?";

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
