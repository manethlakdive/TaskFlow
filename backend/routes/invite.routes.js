import { Router } from "express";
import Member from "../models/Member.model.js";

const router = Router();

// POST /api/invites -> "send" an invite (mock: just adds them to the members list)
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const alreadyMember = await Member.findOne({ email });
  if (alreadyMember) {
    return res.status(409).json({ message: "This person is already a team member" });
  }

  const namePart = email.split("@")[0];
  const displayName = namePart
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const newMember = await Member.create({ name: displayName, email });

  return res.status(200).json({ message: "Invite sent successfully", member: newMember.toPublicJSON() });
});

export default router;
