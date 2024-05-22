const { VerifyTokenAuth, VerifyTokenAndAdmin } = require("./VerifyToken");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");

// Update user by ID
router.put("/:id", VerifyTokenAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user by ID
router.delete("/:id", VerifyTokenAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted..." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Find user by ID (Admin only)
router.get("/find/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password, ...others } = user._doc; // Correctly excluding password
        res.status(200).json(others);
    } catch (err) {
        console.error("Error finding user:", err);
        res.status(500).json({ error: "Failed to find user" });
    }
});

// Get all users (Admin only)
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get user stats (Admin only)
router.get("/stats", VerifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

module.exports = router;