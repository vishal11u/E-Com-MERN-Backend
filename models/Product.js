const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        desc: {
            type: String,
            required: true,
        },
        img: {
            type: Array
        },
        catagories: {
            type: Boolean,
            default: false
        },
        size: {
            type: String
        },
        color: {
            type: String
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Products", ProductsSchema);
