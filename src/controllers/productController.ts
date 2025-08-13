import { Request, Response } from "express";
import { ProductModel } from "../models/Product";
import { ProductCreate } from "../types";

export class ProductController {
  // Get all products
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.getAll();
      res.json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const product = await ProductModel.getById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Create new product
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: ProductCreate = req.body;

      // Validate required fields
      if (
        !productData.imageUrl ||
        !productData.name ||
        productData.count === undefined ||
        productData.width === undefined ||
        productData.height === undefined ||
        !productData.weight
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const newProduct = await ProductModel.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Update product
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const productData = req.body;
      const success = await ProductModel.update(id, productData);

      if (!success) {
        res.status(404).json({ error: "Product not found or no changes made" });
        return;
      }

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete product
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid product ID" });
        return;
      }

      const success = await ProductModel.delete(id);
      if (!success) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
