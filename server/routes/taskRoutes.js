const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  getDashboard,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", protect, getTasks);
router.get("/dashboard", protect, getDashboard);

// Only admin can create task
router.post("/", protect, authorizeRoles("admin"), createTask);

// Member updates task
router.put("/:id", protect, updateTask);

module.exports = router;
