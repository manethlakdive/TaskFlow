import { Router } from "express";
import { members, nextId } from "../data/store.js";

const router = Router();

// GET /api/members -> list all team members
router.get("/", (req, res) => {
  res.status(200).json({ members });
});

export default router;
