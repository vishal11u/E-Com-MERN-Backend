const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
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
        ],
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        address: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", OrderSchema);