// Run this once after connecting your DB for the first time:
//   npm run seed
//
// It clears existing data and inserts the same starter data that used to
// live in data/store.js, so the app looks and behaves the same as before —
// just backed by MongoDB now.

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.model.js";
import Member from "../models/Member.model.js";
import Board from "../models/Board.model.js";

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Member.deleteMany({}), Board.deleteMany({})]);

  await User.create([
    { name: "Amila Supun", email: "amila@example.com", password: "123456" },
    { name: "Maneth Lakdiv", email: "maneth@example.com", password: "123456" },
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
        columnKey: "todo",
        title: "To Do",
        tasks: [{ title: "Design database schema" }, { title: "Set up GitHub repo" }],
      },
      {
        columnKey: "doing",
        title: "Doing",
        tasks: [{ title: "Build Board component" }],
      },
      {
        columnKey: "done",
        title: "Done",
        tasks: [{ title: "Create Vite project" }],
      },
    ],
  });

  console.log("Seed complete: users, members, and board created.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
