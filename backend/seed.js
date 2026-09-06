// Run this once after connecting to Atlas to populate demo data:
//   node seed.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Member from "./models/Member.js";
import Board from "./models/Board.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Member.deleteMany({});
  await Board.deleteMany({});

  const passwordHash = await bcrypt.hash("123456", 10);

  await User.create([
    { name: "Amila Supun", email: "amila@example.com", password: passwordHash },
    { name: "Maneth Lakdiv", email: "maneth@example.com", password: passwordHash },
  ]);

  await Member.create([
    { name: "Amila Supun", email: "amila@example.com" },
    { name: "Maneth Lakdiv", email: "maneth@example.com" },
    { name: "Nipun", email: "nipun@example.com" },
  ]);

  await Board.create({
    name: "Main Board",
    columns: [
      {
        key: "todo",
        title: "To Do",
        tasks: [{ title: "Design database schema" }, { title: "Set up GitHub repo" }],
      },
      {
        key: "doing",
        title: "Doing",
        tasks: [{ title: "Build Board component" }],
      },
      {
        key: "done",
        title: "Done",
        tasks: [{ title: "Create Vite project" }],
      },
    ],
  });

  console.log("Seed data inserted successfully.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
