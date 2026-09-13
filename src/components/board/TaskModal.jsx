import { useState, useEffect } from "react";
import SidePanel from "../common/SidePanel";

export default function TaskModal({ isOpen, onClose, onSave, onDelete, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

        <h2 className="text-2xl font-bold mb-6 mt-8 text-white">{task ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          <input
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc] resize-none"
            placeholder="Description (optional)"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2 mt-auto pt-4">
            <button
              type="submit"
              className="flex-1 text-white py-2 rounded transition-colors"
              style={{ backgroundColor: "#a5b4fc" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8b9cf7")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a5b4fc")}
            >
              {task ? "Save Changes" : "Add Task"}
            </button>
            {task && (
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 rounded text-red-400 border border-red-400/40 hover:bg-red-400/10"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </SidePanel>
  );
}