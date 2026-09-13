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

  console.log("Seed complete: users and members created. Boards are created per-user via the app now.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});