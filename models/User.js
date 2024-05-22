const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true, // Removes any whitespace around the username
            minlength: 4, // Minimum length to ensure valid usernames
            maxlength: 30 // Maximum length for usernames
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Convert email to lowercase
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Regex to validate email format
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false // Do not return the password by default when querying users
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);