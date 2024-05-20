const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        const tokenParts = token.split(" ");
        if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
            const jwtToken = tokenParts[1]; 
            jwt.verify(jwtToken, process.env.JWT_SEC, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("Invalid token format!"); 
        }
    } else {
        return res.status(401).json("Authentication token is missing!");
    }
};

const VerifyTokenAuth = (req, res, next) => {
    VerifyToken(req, res, () => {
        if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
            next();
        } else {
            return res.status(403).json("You are not authorized to perform this action!");
        }
    });
};

module.exports = { VerifyToken, VerifyTokenAuth };