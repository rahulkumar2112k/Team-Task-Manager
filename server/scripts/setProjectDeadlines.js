const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Project = require("../models/project");

dotenv.config();

const deadlines = [
  { name: "Website Redesign", durationDays: 10 },
  { name: "Mobile App Launch", durationDays: 15 },
  { name: "Customer Portal", durationDays: 20 },
  { name: "Analytics Upgrade", durationDays: 25 },
  { name: "Internal Automation", durationDays: 30 },
];

const setProjectDeadlines = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  let updated = 0;

  for (const item of deadlines) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + item.durationDays);

    const result = await Project.updateMany(
      { name: item.name },
      { $set: { dueDate } }
    );

    updated += result.modifiedCount;
  }

  console.log(`Project deadlines updated: ${updated}`);
};

setProjectDeadlines()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
