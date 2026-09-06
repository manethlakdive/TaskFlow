import { Router } from "express";
import Board from "../models/Board.js";

const router = Router();

// helper: there is one shared board for this stage of the project
const getMainBoard = async () => {
  let board = await Board.findOne({ name: "Main Board" });
  if (!board) {
    board = await Board.create({ name: "Main Board", columns: [] });
  }
  return board;
};

// GET /api/boards -> returns the whole board (all columns + tasks)
router.get("/", async (req, res) => {
  try {
    const board = await getMainBoard();
    res.status(200).json({ columns: board.columns });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/boards/tasks -> create a new task in a given column
router.post("/tasks", async (req, res) => {
  try {
    const { columnId, title } = req.body;

    if (!columnId || !title) {
      return res.status(400).json({ message: "columnId and title are required" });
    }

    const board = await getMainBoard();
    const column = board.columns.find((c) => c.key === columnId);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    column.tasks.push({ title });
    await board.save();

    const savedTask = column.tasks[column.tasks.length - 1];
    res.status(201).json({ task: savedTask, columns: board.columns });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/boards/tasks/:taskId/move -> move a task to another column
router.patch("/tasks/:taskId/move", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { toColumnId } = req.body;

    if (!toColumnId) {
      return res.status(400).json({ message: "toColumnId is required" });
    }

    const board = await getMainBoard();
    const fromColumn = board.columns.find((c) =>
      c.tasks.some((t) => t._id.toString() === taskId)
    );
    const toColumn = board.columns.find((c) => c.key === toColumnId);

    if (!fromColumn || !toColumn) {
      return res.status(404).json({ message: "Task or target column not found" });
    }

    const task = fromColumn.tasks.find((t) => t._id.toString() === taskId);
    const taskData = { title: task.title };

    fromColumn.tasks = fromColumn.tasks.filter((t) => t._id.toString() !== taskId);
    toColumn.tasks.push(taskData);

    await board.save();
    res.status(200).json({ columns: board.columns });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
