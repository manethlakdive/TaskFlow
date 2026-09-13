import { Router } from "express";
import Invite from "../models/Invite.model.js";
import Board from "../models/Board.model.js";
import { getIO } from "../socket.js";

const router = Router();

// POST /api/invites -> send an invite request
router.post("/", async (req, res) => {
  const { fromUserId, toUserId, boardId } = req.body;

  if (!fromUserId || !toUserId || !boardId) {
    return res.status(400).json({ message: "fromUserId, toUserId and boardId are required" });
  }
  if (fromUserId === toUserId) {
    return res.status(400).json({ message: "You can't invite yourself" });
  }

  const existing = await Invite.findOne({ fromUser: fromUserId, toUser: toUserId, board: boardId, status: "pending" });
  if (existing) return res.status(409).json({ message: "Invite already sent" });

  const invite = await Invite.create({ fromUser: fromUserId, toUser: toUserId, board: boardId });

  // e user ta ehema real-time ekata notification ekak (bell icon eka refresh karanna)
  getIO().to(`user:${toUserId}`).emit("invite:received");

  return res.status(201).json({ invite: invite.toPublicJSON() });
});

// GET /api/invites/mine?userId=...  -> pending invites received by this user
router.get("/mine", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const invites = await Invite.find({ toUser: userId, status: "pending" })
    .populate("fromUser", "name email")
    .populate("board", "name");

  return res.status(200).json({
    invites: invites.map((inv) => ({
      id: inv._id.toString(),
      fromUser: inv.fromUser && { id: inv.fromUser._id.toString(), name: inv.fromUser.name, email: inv.fromUser.email },
      board: inv.board && { id: inv.board._id.toString(), name: inv.board.name },
    })),
  });
});

// PATCH /api/invites/:inviteId  -> accept or reject
router.patch("/:inviteId", async (req, res) => {
  const { inviteId } = req.params;
  const { action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "action must be 'accept' or 'reject'" });
  }

  const invite = await Invite.findById(inviteId);
  if (!invite) return res.status(404).json({ message: "Invite not found" });

  invite.status = action === "accept" ? "accepted" : "rejected";
  await invite.save();

  if (action === "accept") {
    const board = await Board.findById(invite.board);
    if (board && !board.members.some((m) => m.toString() === invite.toUser.toString())) {
      board.members.push(invite.toUser);
      await board.save();

      // e invite ekata accept karapu userge dashboard eke boards list eka refresh wenna
      getIO().to(`user:${invite.toUser.toString()}`).emit("invite:accepted");

      // e board eka dan open karagena innawa nam, members list eka update wenna
      getIO().to(`board:${board._id}`).emit("board:update", board.toPublicJSON());
    }
  }

  return res.status(200).json({ invite: invite.toPublicJSON() });
});

export default router;