const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    },
    {
        timestamps: true // Automatically manage createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Cart", CartSchema);
