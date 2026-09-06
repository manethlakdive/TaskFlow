import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const columnSchema = new mongoose.Schema({
  // Keep a stable, human-readable slug ("todo", "doing", "done") separate from
  // Mongo's _id, since the frontend already references columns by this id.
  columnKey: { type: String, required: true },
  title: { type: String, required: true },
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema(
  {
    // Single-board setup for now — one document holds the whole Kanban board.
    name: { type: String, default: "Main Board" },
    columns: [columnSchema],
  },
  { timestamps: true }
);

// Reshape a board doc into the { columns: [{ id, title, tasks: [{ id, title }] }] }
// format the existing frontend already expects, so no frontend changes are needed.
boardSchema.methods.toPublicJSON = function () {
  return {
    columns: this.columns.map((col) => ({
      id: col.columnKey,
      title: col.title,
      tasks: col.tasks.map((t) => ({ id: t._id.toString(), title: t.title })),
    })),
  };
};

export default mongoose.model("Board", boardSchema);
