import { Router } from "express";
import Member from "../models/Member.js";

const router = Router();

// POST /api/invites -> "send" an invite (adds them to the members collection)
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Member.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "This person is already a team member" });
    }

    const namePart = email.split("@")[0];
    const displayName = namePart
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const newMember = await Member.create({ name: displayName, email: email.toLowerCase() });

    res.status(200).json({ message: "Invite sent successfully", member: newMember });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
