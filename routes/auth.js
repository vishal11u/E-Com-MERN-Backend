const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

// Registration -------------
router.post("/register", async (req, res) => {
    // Validate request body
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Create a new user instance
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        // Save the user to the database
        const savedUser = await newUser.save();
        // Respond with the created user object
        res.status(201).json(savedUser);
    } catch (error) {
        // Handle and log the error
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// Login -------------------
router.post("/login", async (req, res) => {
    try {
        // Validate request body
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Find the user in the database
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Decrypt the stored password
        const decryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);

        // Compare the decrypted password with the provided password
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const accesToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWK_SEC,
            { expiresIn: "3d" }
        )

        // Respond with the user details (excluding password)
        const { password, ...userDetails } = user._doc;
        res.status(200).json({ ...userDetails, accesToken });
    } catch (err) {
        // Handle and log the error
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
});

module.exports = router;
