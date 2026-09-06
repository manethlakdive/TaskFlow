import { Router } from "express";
import Member from "../models/Member.js";

const router = Router();

// GET /api/members -> list all team members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: 1 });
    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
