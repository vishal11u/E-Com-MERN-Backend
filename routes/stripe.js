const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
    try {
        const { tokenId, amount } = req.body;
        if (!tokenId || !amount) {
            return res.status(400).json({ error: "Token ID and amount are required." });
        }

        const charge = await stripe.charges.create({
            source: tokenId,
            amount: amount,
            currency: "usd",
        });

        res.status(200).json(charge);
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: "Payment failed", details: error.message });
    }
});

module.exports = router;