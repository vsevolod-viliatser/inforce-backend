import { Request, Response } from "express";
import { CommentModel } from "../models/Comment";
import { CommentCreate } from "../types";

export class CommentController {
  // Get all comments
  static async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await CommentModel.getAll();
      res.json(comments);
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get comment by ID
  static async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid comment ID" });
        return;
      }

      const comment = await CommentModel.getById(id);
      if (!comment) {
        res.status(404).json({ error: "Comment not found" });
        return;
      }

      res.json(comment);
    } catch (error) {
      console.error("Error getting comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get comments by product ID
  static async getCommentsByProductId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const comments = await CommentModel.getByProductId(productId);
      res.json(comments);
    } catch (error) {
      console.error("Error getting comments by product ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Create new comment
  static async createComment(req: Request, res: Response): Promise<void> {
    try {
      const commentData: CommentCreate = req.body;

      // Validate required fields
      if (
        !commentData.productId ||
        !commentData.description ||
        !commentData.date
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const newComment = await CommentModel.create(commentData);
      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update comment
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid comment ID" });
        return;
      }

      const commentData = req.body;
      const success = await CommentModel.update(id, commentData);

      if (!success) {
        res.status(404).json({ error: "Comment not found or no changes made" });
        return;
      }

      res.json({ message: "Comment updated successfully" });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete comment
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid comment ID" });
        return;
      }

      const success = await CommentModel.delete(id);
      if (!success) {
        res.status(404).json({ error: "Comment not found" });
        return;
      }

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
