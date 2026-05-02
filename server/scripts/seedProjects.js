const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");

dotenv.config();

const projectSeeds = [
  {
    name: "Website Redesign",
    description: "Refresh landing pages, dashboard layouts, and navigation.",
    durationDays: 10,
  },
  {
    name: "Mobile App Launch",
    description: "Prepare the first mobile release checklist and QA work.",
    durationDays: 15,
  },
  {
    name: "Customer Portal",
    description: "Build customer-facing task and project visibility tools.",
    durationDays: 20,
  },
  {
    name: "Analytics Upgrade",
    description: "Improve reporting, dashboards, and progress metrics.",
    durationDays: 25,
  },
  {
    name: "Internal Automation",
    description: "Automate recurring team operations and task handoffs.",
    durationDays: 30,
  },
];

const taskTemplates = [
  { title: "Plan scope", status: "done", priority: "medium" },
  { title: "Create implementation tasks", status: "in-progress", priority: "high" },
  { title: "Review with stakeholders", status: "todo", priority: "medium" },
  { title: "Final QA pass", status: "todo", priority: "high" },
];

const seedProjects = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    throw new Error("No admin user found. Register one admin before seeding projects.");
  }

  const members = await User.find({ role: "member" }).limit(10);
  if (members.length === 0) {
    throw new Error("No member users found. Run seedMembers.js first.");
  }

  let created = 0;
  let skipped = 0;

  for (const [projectIndex, seed] of projectSeeds.entries()) {
    const existingProject = await Project.findOne({
      name: seed.name,
      createdBy: admin._id,
    });

    if (existingProject) {
      skipped += 1;
      continue;
    }

    const projectMembers = [
      admin._id,
      ...members
        .slice(projectIndex * 2, projectIndex * 2 + 3)
        .map((member) => member._id),
    ];

    const project = await Project.create({
      name: seed.name,
      description: seed.description,
      dueDate: new Date(Date.now() + seed.durationDays * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      members: projectMembers,
    });

    for (const [taskIndex, task] of taskTemplates.entries()) {
      const assignee = projectMembers[(taskIndex % (projectMembers.length - 1)) + 1];

      await Task.create({
        ...task,
        description: `${task.title} for ${seed.name}.`,
        project: project._id,
        assignedTo: assignee,
        dueDate: new Date(Date.now() + (taskIndex + 1) * 24 * 60 * 60 * 1000),
      });
    }

    created += 1;
  }

  console.log(`Projects created: ${created}`);
  console.log(`Projects already existed: ${skipped}`);
  console.log(`Admin owner: ${admin.email}`);
};

seedProjects()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
