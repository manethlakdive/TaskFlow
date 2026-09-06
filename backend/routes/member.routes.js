import { Router } from "express";
import Member from "../models/Member.model.js";

const router = Router();

// GET /api/members -> list all team members
router.get("/", async (req, res) => {
  const members = await Member.find();
  return res.status(200).json({ members: members.map((m) => m.toPublicJSON()) });
});

export default router;
