import { Router } from "express";
import User from "../models/User.model.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.status(200).json({ user: user.toPublicJSON() });
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const newUser = await User.create({ name, email, password });

  return res.status(201).json({ user: newUser.toPublicJSON() });
});

export default router;
