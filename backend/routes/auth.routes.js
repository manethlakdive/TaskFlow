import { Router } from "express";
import { users, nextId } from "../data/store.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const newUser = { id: nextId(), name, email, password };
  users.push(newUser);

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

export default router;
