const jwt = require("jsonwebtoken");

// Middleware to verify any JWT token
const VerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (authHeader) {
        const tokenParts = authHeader.split(" ");
        if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
            const jwtToken = tokenParts[1];
            console.log("JWT Token:", jwtToken);

            jwt.verify(jwtToken, process.env.JWT_SEC, (err, user) => { // Corrected environment variable to JWT_SEC
                if (err) {
                    console.error("JWT Verification Error:", err);
                    return res.status(403).json({ error: "Token is not valid!" });
                }
                req.user = user;
                next();
            });
        } else {
            console.error("Invalid Token Format");
            return res.status(401).json({ error: "Invalid token format!" });
        }
    } else {
        console.error("Authentication Token is Missing");
        return res.status(401).json({ error: "Authentication token is missing!" });
    }
};

// Middleware to verify token and check if the user is authorized (user must be same as the one in params or admin)
const VerifyTokenAuth = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
            next();
        } else {
            return res.status(403).json({ error: "You are not authorized to perform this action!" });
        }
    });
};

// Middleware to verify token and check if the user is an admin
const VerifyTokenAndAdmin = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ error: "You are not authorized to perform this action!" });
        }
    });
};

module.exports = { VerifyToken, VerifyTokenAuth, VerifyTokenAndAdmin };