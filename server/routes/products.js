import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Add new product
router.post("/", async (req, res) => {
  try {
    console.log("📦 Incoming product data:", req.body);

    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();

    return res.status(201).json({
      message: "Product added!",
      product: newProduct,
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;

