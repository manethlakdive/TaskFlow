import { useState, useEffect } from "react";
import Column from "./Column";

const API_URL = "http://localhost:5001/api";

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/boards`)
      .then((res) => res.json())
      .then((data) => setColumns(data.columns))
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (e, taskId, fromColumnId) => {
    setDraggedTask({ taskId, fromColumnId });
  };

  const handleDrop = async (e, toColumnId) => {
    if (!draggedTask) return;
    const { taskId, fromColumnId } = draggedTask;
    if (fromColumnId === toColumnId) return;

    // optimistic UI update
    setColumns((prev) => {
      const sourceCol = prev.find((c) => c.id === fromColumnId);
      const task = sourceCol.tasks.find((t) => t.id === taskId);
      return prev.map((col) => {
        if (col.id === fromColumnId) return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        if (col.id === toColumnId) return { ...col, tasks: [...col.tasks, task] };
        return col;
      });
    });
    setDraggedTask(null);

    // sync with backend
    const res = await fetch(`${API_URL}/boards/tasks/${taskId}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toColumnId }),
    });
    const data = await res.json();
    if (res.ok) setColumns(data.columns);
  };

  if (loading) return <p className="p-4 text-gray-400">Loading board…</p>;

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columns.map((col) => (
        <Column key={col.id} column={col} onDragStart={handleDragStart} onDrop={handleDrop} />
      ))}
    </div>
  );
}