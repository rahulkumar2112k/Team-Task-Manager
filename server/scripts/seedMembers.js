const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");

dotenv.config();

const members = [
  { name: "Aarav Sharma", email: "aarav@example.com" },
  { name: "Diya Patel", email: "diya@example.com" },
  { name: "Kabir Singh", email: "kabir@example.com" },
  { name: "Ananya Verma", email: "ananya@example.com" },
  { name: "Rohan Mehta", email: "rohan@example.com" },
  { name: "Meera Nair", email: "meera@example.com" },
  { name: "Ishaan Rao", email: "ishaan@example.com" },
  { name: "Sara Khan", email: "sara@example.com" },
  { name: "Vivaan Gupta", email: "vivaan@example.com" },
  { name: "Neha Joshi", email: "neha@example.com" },
];

const seedMembers = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash("password123", 10);
  let created = 0;
  let skipped = 0;

  for (const member of members) {
    const existingUser = await User.findOne({ email: member.email });

    if (existingUser) {
      skipped += 1;
      continue;
    }

    await User.create({
      ...member,
      password,
      role: "member",
    });

    created += 1;
  }

  console.log(`Members created: ${created}`);
  console.log(`Members already existed: ${skipped}`);
  console.log("Default password: password123");
};

seedMembers()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
