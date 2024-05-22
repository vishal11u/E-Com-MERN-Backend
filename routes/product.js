const { VerifyTokenAuth, VerifyTokenAndAdmin } = require("./VerifyToken");
const router = require("express").Router();
const Product = require("../models/Product");

// Create a new product (Admin only)
router.post("/", VerifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ error: "Failed to save product" });
    }
});

// Update a product by ID (Admin only)
router.put("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete a product by ID (Admin only)
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product has been deleted..." });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Get all products or filter by category or new
router.get("/", async (req, res) => {
    const qCategory = req.query.category;
    const qNew = req.query.new;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                category: { $in: [qCategory] },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Get a single product by ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

module.exports = router;