const { VerifyTokenAuth, VerifyTokenAndAdmin, VerifyToken } = require("./VerifyToken");
const router = require("express").Router();
const Cart = require("../models/Cart");

// Create a new cart
router.post("/", VerifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        console.error("Error saving cart:", err);
        res.status(500).json({ error: "Failed to save cart" });
    }
});

// Update a cart by ID
router.put("/:id", VerifyTokenAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).json({ error: "Failed to update cart" });
    }
});

// Delete a cart by ID
router.delete("/:id", VerifyTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Cart has been deleted..." });
    } catch (err) {
        console.error("Error deleting cart:", err);
        res.status(500).json({ error: "Failed to delete cart" });
    }
});

// Get a user's cart by user ID
router.get("/find/:userId", VerifyTokenAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

// Get all carts (Admin only)
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        console.error("Error fetching carts:", err);
        res.status(500).json({ error: "Failed to fetch carts" });
    }
});

module.exports = router;