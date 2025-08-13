import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

// GET /api/products - Get all products
router.get("/", ProductController.getAllProducts);

// GET /api/products/:id - Get product by ID
router.get("/:id", ProductController.getProductById);

// POST /api/products - Create new product
router.post("/", ProductController.createProduct);

// PUT /api/products/:id - Update product
router.put("/:id", ProductController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete("/:id", ProductController.deleteProduct);

export default router;
