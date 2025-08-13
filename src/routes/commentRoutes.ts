import { Router } from "express";
import { CommentController } from "../controllers/commentController";

const router = Router();

// GET /api/comments - Get all comments
router.get("/", CommentController.getAllComments);

// GET /api/comments/:id - Get comment by ID
router.get("/:id", CommentController.getCommentById);

// GET /api/comments/product/:productId - Get comments by product ID
router.get("/product/:productId", CommentController.getCommentsByProductId);

// POST /api/comments - Create new comment
router.post("/", CommentController.createComment);

// PUT /api/comments/:id - Update comment
router.put("/:id", CommentController.updateComment);

// DELETE /api/comments/:id - Delete comment
router.delete("/:id", CommentController.deleteComment);

export default router;
