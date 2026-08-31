import { Router } from "express";
import { columns, nextId } from "../data/store.js";

const router = Router();

// GET /api/boards  -> returns the whole board (all columns + tasks)
router.get("/", (req, res) => {
  res.status(200).json({ columns });
});

// POST /api/boards/tasks  -> create a new task in a given column
router.post("/tasks", (req, res) => {
  const { columnId, title } = req.body;

  if (!columnId || !title) {
    return res.status(400).json({ message: "columnId and title are required" });
  }

  const column = columns.find((c) => c.id === columnId);
  if (!column) {
    return res.status(404).json({ message: "Column not found" });
  }

  const task = { id: nextId(), title };
  column.tasks.push(task);

  return res.status(201).json({ task, columns });
});

// PATCH /api/boards/tasks/:taskId/move -> move a task to another column
router.patch("/tasks/:taskId/move", (req, res) => {
  const { taskId } = req.params;
  const { toColumnId } = req.body;

  if (!toColumnId) {
    return res.status(400).json({ message: "toColumnId is required" });
  }

  const fromColumn = columns.find((c) => c.tasks.some((t) => t.id === taskId));
  const toColumn = columns.find((c) => c.id === toColumnId);

  if (!fromColumn || !toColumn) {
    return res.status(404).json({ message: "Task or target column not found" });
  }

  const task = fromColumn.tasks.find((t) => t.id === taskId);
  fromColumn.tasks = fromColumn.tasks.filter((t) => t.id !== taskId);
  toColumn.tasks.push(task);

  return res.status(200).json({ columns });
});

export default router;
