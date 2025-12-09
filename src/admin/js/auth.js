const { verifyToken } = require("../utils/jwt");

// Accept token either from Authorization header or from cookie named 'admin_token' or 'token'
module.exports = (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    // if no header token, try to parse from cookie string
    if (!token && req.headers.cookie) {
        const cookies = req.headers.cookie.split(';').map(c => c.trim());
        const found = cookies.find(c => c.startsWith('admin_token=') || c.startsWith('token='));
        if (found) {
            token = decodeURIComponent(found.split('=')[1]);
        }
    }

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};