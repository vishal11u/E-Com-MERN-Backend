const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userroute = require("./routes/userRoute");
const Auth = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use("/api/user", userroute);
app.use("/api/auth", Auth);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});