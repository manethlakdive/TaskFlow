import { Router } from "express";
import Board from "../models/Board.model.js";
import { getIO } from "../socket.js";

const router = Router();

const defaultColumns = () => [
  { columnKey: "todo", title: "To Do", tasks: [] },
  { columnKey: "doing", title: "Doing", tasks: [] },
  { columnKey: "done", title: "Done", tasks: [] },
];

// board eke room ekata update ekak broadcast karana helper
const broadcastBoardUpdate = (board) => {
  getIO().to(`board:${board._id}`).emit("board:update", board.toPublicJSON());
};

// GET /api/boards/mine?userId=... -> owner widihata witharak nemei, member widihatath boards
router.get("/mine", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });

  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }],
  }).sort({ createdAt: -1 });

  return res.status(200).json({ boards: boards.map((b) => b.toSummaryJSON()) });
});

// GET /api/boards/:boardId -> full board (columns + tasks)
router.get("/:boardId", async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });
  return res.status(200).json({ board: board.toPublicJSON() });
});

// GET /api/boards/:boardId/members -> populated member list for this board
router.get("/:boardId/members", async (req, res) => {
  const board = await Board.findById(req.params.boardId).populate("members", "name email");
  if (!board) return res.status(404).json({ message: "Board not found" });

  return res.status(200).json({
    members: board.members.map((m) => ({ id: m._id.toString(), name: m.name, email: m.email })),
  });
});

// POST /api/boards -> create a new board
router.post("/", async (req, res) => {
  const { userId, name, description, deadline } = req.body;
  if (!userId || !name) return res.status(400).json({ message: "userId and name are required" });

  const board = await Board.create({
    owner: userId,
    name,
    description: description || "",
    columns: defaultColumns(),
    deadline: deadline || null,
  });

  return res.status(201).json({ board: board.toPublicJSON() });
});

// PATCH /api/boards/:boardId -> rename / update description / deadline
router.patch("/:boardId", async (req, res) => {
  const { name, description, deadline } = req.body;
  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  if (name !== undefined) board.name = name;
  if (description !== undefined) board.description = description;
  if (deadline !== undefined) board.deadline = deadline || null;
  await board.save();

  broadcastBoardUpdate(board);
  return res.status(200).json({ board: board.toPublicJSON() });
});

// DELETE /api/boards/:boardId
router.delete("/:boardId", async (req, res) => {
  const board = await Board.findByIdAndDelete(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  getIO().to(`board:${board._id}`).emit("board:deleted", { boardId: board._id.toString() });
  return res.status(200).json({ message: "Board deleted" });
});

// POST /api/boards/:boardId/tasks -> new task always lands in "todo"
router.post("/:boardId/tasks", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const todoColumn = board.columns.find((c) => c.columnKey === "todo");
  todoColumn.tasks.push({ title, description: description || "" });
  await board.save();

  broadcastBoardUpdate(board);
  return res.status(201).json({ board: board.toPublicJSON() });
});

// PATCH /api/boards/:boardId/tasks/:taskId -> edit title/description
router.patch("/:boardId/tasks/:taskId", async (req, res) => {
  const { title, description } = req.body;
  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const column = board.columns.find((c) => c.tasks.id(req.params.taskId));
  if (!column) return res.status(404).json({ message: "Task not found" });

  const task = column.tasks.id(req.params.taskId);
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  await board.save();

  broadcastBoardUpdate(board);
  return res.status(200).json({ board: board.toPublicJSON() });
});

// DELETE /api/boards/:boardId/tasks/:taskId
router.delete("/:boardId/tasks/:taskId", async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const column = board.columns.find((c) => c.tasks.id(req.params.taskId));
  if (!column) return res.status(404).json({ message: "Task not found" });

  column.tasks.pull(req.params.taskId);
  await board.save();

  broadcastBoardUpdate(board);
  return res.status(200).json({ board: board.toPublicJSON() });
});

// PATCH /api/boards/:boardId/tasks/:taskId/move
router.patch("/:boardId/tasks/:taskId/move", async (req, res) => {
  const { toColumnId } = req.body;
  if (!toColumnId) return res.status(400).json({ message: "toColumnId is required" });

  const board = await Board.findById(req.params.boardId);
  if (!board) return res.status(404).json({ message: "Board not found" });

  const fromColumn = board.columns.find((c) => c.tasks.id(req.params.taskId));
  const toColumn = board.columns.find((c) => c.columnKey === toColumnId);
  if (!fromColumn || !toColumn) return res.status(404).json({ message: "Task or target column not found" });

  const task = fromColumn.tasks.id(req.params.taskId);
  const movedTask = { title: task.title, description: task.description };
  fromColumn.tasks.pull(req.params.taskId);
  toColumn.tasks.push(movedTask);

  await board.save();

  broadcastBoardUpdate(board);
  return res.status(200).json({ board: board.toPublicJSON() });
});

export default router;