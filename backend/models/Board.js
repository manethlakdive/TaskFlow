import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const columnSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. "todo", "doing", "done" - used as columnId
  title: { type: String, required: true }, // e.g. "To Do"
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Main Board" },
    columns: [columnSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Board", boardSchema);
