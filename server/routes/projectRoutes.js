const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  addMember,
  updateProjectProgress,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", protect, getProjects);

// Only admin can create project
router.post("/", protect, authorizeRoles("admin"), createProject);

router.post("/add-member", protect, authorizeRoles("admin"), addMember);

router.patch("/:id/progress", protect, updateProjectProgress);

router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

module.exports = router;
