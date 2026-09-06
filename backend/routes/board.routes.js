import { Router } from "express";
import Board from "../models/Board.model.js";

const router = Router();

// This app works with a single board document. Fetch it once per request.
const getBoard = () => Board.findOne();

// GET /api/boards  -> returns the whole board (all columns + tasks)
router.get("/", async (req, res) => {
  const board = await getBoard();
  if (!board) {
    return res.status(404).json({ message: "Board not found. Run the seed script first." });
  }
  return res.status(200).json(board.toPublicJSON());
});

// POST /api/boards/tasks  -> create a new task in a given column
router.post("/tasks", async (req, res) => {
  const { columnId, title } = req.body;

  if (!columnId || !title) {
    return res.status(400).json({ message: "columnId and title are required" });
  }

  const board = await getBoard();
  if (!board) {
    return res.status(404).json({ message: "Board not found. Run the seed script first." });
  }

  const column = board.columns.find((c) => c.columnKey === columnId);
  if (!column) {
    return res.status(404).json({ message: "Column not found" });
  }

  column.tasks.push({ title });
  await board.save();

  const savedColumn = board.columns.find((c) => c.columnKey === columnId);
  const task = savedColumn.tasks[savedColumn.tasks.length - 1];

  return res.status(201).json({
    task: { id: task._id.toString(), title: task.title },
    columns: board.toPublicJSON().columns,
  });
});

// PATCH /api/boards/tasks/:taskId/move -> move a task to another column
router.patch("/tasks/:taskId/move", async (req, res) => {
  const { taskId } = req.params;
  const { toColumnId } = req.body;

  if (!toColumnId) {
    return res.status(400).json({ message: "toColumnId is required" });
  }

  const board = await getBoard();
  if (!board) {
    return res.status(404).json({ message: "Board not found. Run the seed script first." });
  }

  const fromColumn = board.columns.find((c) => c.tasks.id(taskId));
  const toColumn = board.columns.find((c) => c.columnKey === toColumnId);

  if (!fromColumn || !toColumn) {
    return res.status(404).json({ message: "Task or target column not found" });
  }

  const task = fromColumn.tasks.id(taskId);
  const movedTask = { title: task.title };

  fromColumn.tasks.pull(taskId);
  toColumn.tasks.push(movedTask);

  await board.save();

  return res.status(200).json(board.toPublicJSON());
});

export default router;
