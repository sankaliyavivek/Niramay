const jwt = require('jsonwebtoken');
const User = require('../modal/user');

const Authorization = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Assuming token is in cookies
        if (!token) {
            return res.status(401).json({ message: "Access Denied! No Token Provided" });
        }

        // Verify JWT Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized Access! Invalid Token" });
        }

        // Find the user based on token ID
        const user = await User.findById(verified.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Attach user to request object (Optional)
        req.user = user;
        next();
    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(401).json({ message: "Authorization Failed" });
    }
}

module.exports = { Authorization };
