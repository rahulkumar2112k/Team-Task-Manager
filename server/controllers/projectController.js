const Project = require("../models/project");
const Task = require("../models/task");

const getDeadlineStatus = (dueDate) => {
  if (!dueDate) {
    return {
      daysRemaining: null,
      isOverdue: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dueDate);
  deadline.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    daysRemaining,
    isOverdue: daysRemaining < 0,
  };
};

const attachProjectProgress = async (projects) => {
  const projectIds = projects.map((project) => project._id);
  const taskStats = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: "$project",
        total: { $sum: 1 },
        todo: {
          $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] },
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
        },
        done: {
          $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
        },
      },
    },
  ]);

  const statsByProject = new Map(
    taskStats.map((stats) => [stats._id.toString(), stats])
  );

  return projects.map((project) => {
    const projectObject = project.toObject();
    const stats = statsByProject.get(project._id.toString()) || {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    };
    const progress =
      stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    return {
      ...projectObject,
      deadline: getDeadlineStatus(projectObject.dueDate),
      stats: {
        total: stats.total,
        todo: stats.todo,
        inProgress: stats.inProgress,
        done: stats.done,
        progress,
      },
    };
  });
};

// GET PROJECTS
const getProjects = async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? { createdBy: req.user.id } : { members: req.user.id };

    const projects = await Project.find(query)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("progressReports.member", "name email");

    res.json(await attachProjectProgress(projects));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PROJECT (Admin only)
const createProject = async (req, res) => {
  try {
    const { name, description, dueDate, durationDays } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    let projectDueDate = dueDate ? new Date(dueDate) : null;

    if (!projectDueDate && durationDays) {
      projectDueDate = new Date();
      projectDueDate.setDate(projectDueDate.getDate() + Number(durationDays));
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      dueDate: projectDueDate,
      createdBy: req.user.id,
      members: [req.user.id], // creator also member
    });

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("progressReports.member", "name email");

    const [projectWithProgress] = await attachProjectProgress([populatedProject]);

    res.status(201).json({
      message: "Project created",
      project: projectWithProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// add member function
const addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only creator (admin) can add members
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Avoid duplicate
    if (project.members.some((member) => member.toString() === userId)) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("progressReports.member", "name email");
    const [projectWithProgress] = await attachProjectProgress([populatedProject]);

    res.json({
      message: "Member added",
      project: projectWithProgress,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProjectProgress = async (req, res) => {
  try {
    const { percent, note } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isProjectMember = project.members.some(
      (member) => member.toString() === req.user.id
    );

    if (!isProjectMember && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const progressPercent = Number(percent);

    if (Number.isNaN(progressPercent) || progressPercent < 0 || progressPercent > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    const existingReport = project.progressReports.find(
      (report) => report.member.toString() === req.user.id
    );

    if (existingReport) {
      existingReport.percent = progressPercent;
      existingReport.note = note || "";
      existingReport.updatedAt = new Date();
    } else {
      project.progressReports.push({
        member: req.user.id,
        percent: progressPercent,
        note,
        updatedAt: new Date(),
      });
    }

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("progressReports.member", "name email");
    const [projectWithProgress] = await attachProjectProgress([populatedProject]);

    res.json({
      message: "Progress updated",
      project: projectWithProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  addMember,
  updateProjectProgress,
  deleteProject,
};
