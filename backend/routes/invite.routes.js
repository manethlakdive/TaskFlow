import { Router } from "express";
import { members, nextId } from "../data/store.js";

const router = Router();

// POST /api/invites -> "send" an invite (mock: just adds them to the members list)
router.post("/", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const alreadyMember = members.some((m) => m.email === email);
  if (alreadyMember) {
    return res.status(409).json({ message: "This person is already a team member" });
  }

  const namePart = email.split("@")[0];
  const displayName = namePart
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const newMember = { id: nextId(), name: displayName, email };
  members.push(newMember);

  return res.status(200).json({ message: "Invite sent successfully", member: newMember });
});

export default router;
