const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, authorizeRoles("admin"), getUsers);

module.exports = router;
