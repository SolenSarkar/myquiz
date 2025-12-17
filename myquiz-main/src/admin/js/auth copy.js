const router = require("express").Router();
const { register, login, adminLogin, me, logout } = require("../controllers/authController");
const requireAuth = require('../middlewares/auth');

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);

// session endpoints
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;