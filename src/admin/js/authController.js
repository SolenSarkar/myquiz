const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already used" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashed });

        const token = generateToken(user);

        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Incorrect password" });

        const token = generateToken(user);

        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin login using credentials from .env
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
        const adminPassword = process.env.ADMIN_PASSWORD || '';
        const adminEmailList = adminEmailsEnv.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        if (!adminPassword || !adminEmailList.length) return res.status(500).json({ error: 'Admin credentials not configured' });

        const normalized = (email || '').toLowerCase();

        if (!adminEmailList.includes(normalized) || password !== adminPassword) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        // create a minimal admin "user" object for token
        const adminUser = { _id: `admin-${Date.now()}`, email: normalized, role: 'admin' };
        const token = generateToken(adminUser);

        // set httpOnly cookie so browser will include it on subsequent requests
        res.cookie('admin_token', token, { httpOnly: true, sameSite: 'lax' });

        // return success (do not include token in body for security)
        res.json({ ok: true, message: 'Admin authenticated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Return current authenticated user (from token)
exports.me = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    // return minimal safe user info
    const { id, email, role } = req.user;
    res.json({ id, email, role });
};

// Logout by clearing the admin_token cookie
exports.logout = async (req, res) => {
    try {
        res.clearCookie('admin_token', { httpOnly: true, sameSite: 'lax' });
        // also clear generic token cookie name if present
        res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};