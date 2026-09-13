import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const columnSchema = new mongoose.Schema({
  columnKey: { type: String, required: true },
  title: { type: String, required: true },
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    columns: [columnSchema],
    // project eka complete karanna one deadline eka (date + time)
    deadline: { type: Date, default: null },
  },
  { timestamps: true }
);

boardSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    owner: this.owner.toString(),
    members: this.members.map((m) => m.toString()),
    columns: this.columns.map((col) => ({
      id: col.columnKey,
      title: col.title,
      tasks: col.tasks.map((t) => ({
        id: t._id.toString(),
        title: t.title,
        description: t.description,
      })),
    })),
    deadline: this.deadline ? this.deadline.toISOString() : null,
    createdAt: this.createdAt ? this.createdAt.toISOString() : null,
  };
};

// lighter shape for the "My Boards" list (no need to send all tasks)
boardSchema.methods.toSummaryJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    taskCount: this.columns.reduce((sum, c) => sum + c.tasks.length, 0),
    deadline: this.deadline ? this.deadline.toISOString() : null,
    createdAt: this.createdAt ? this.createdAt.toISOString() : null,
  };
};

export default mongoose.model("Board", boardSchema);