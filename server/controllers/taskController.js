const Task = require("../models/task");
const Project = require("../models/project");

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { assignedTo: req.user.id };

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE TASK (Admin only)
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({
        message: "Title, project, and assignee are required",
      });
    }

    // 1. Check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Check if assigned user is part of project
    if (!project.members.some((member) => member.toString() === assignedTo)) {
      return res.status(400).json({
        message: "User is not a member of this project",
      });
    }

    // 3. Create task
    const task = await Task.create({
      title: title.trim(),
      description,
      project: projectId,
      assignedTo,
      dueDate,
    });

    res.status(201).json({
      message: "Task created",
      task,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { title, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    // update only if provided
    task.title = title ?? task.title;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { assignedTo: req.user.id };
    const tasks = await Task.find(query);

    const total = tasks.length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const done = tasks.filter(t => t.status === "done").length;

    const overdue = tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length;

    res.json({
      total,
      todo,
      inProgress,
      done,
      overdue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, getDashboard };
