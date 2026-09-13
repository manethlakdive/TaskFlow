import { Router } from "express";
import User from "../models/User.model.js";

const router = Router();

// GET /api/users/search?q=...&excludeId=...
router.get("/search", async (req, res) => {
  const { q, excludeId } = req.query;
  if (!q || !q.trim()) return res.status(200).json({ users: [] });

  const regex = new RegExp(q.trim(), "i");
  const query = { $or: [{ name: regex }, { email: regex }] };
  if (excludeId) query._id = { $ne: excludeId };

  const users = await User.find(query).limit(5);
  return res.status(200).json({ users: users.map((u) => u.toPublicJSON()) });
});

export default router;