const jwt = require('jsonwebtoken');
const User = require('../modal/user');

const Authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Please login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "User not found. Please login again." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ error: "Invalid token. Please login again." });
    }
};

module.exports = { Authentication };
