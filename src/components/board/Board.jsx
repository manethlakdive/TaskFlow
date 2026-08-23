import { useState } from "react";
import Column from "./Column";
import { initialColumns } from "../../data/mockData";

export default function Board() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, taskId, fromColumnId) => {
    setDraggedTask({ taskId, fromColumnId });
  };

  const handleDrop = (e, toColumnId) => {
    if (!draggedTask) return;
    const { taskId, fromColumnId } = draggedTask;
    if (fromColumnId === toColumnId) return;

    setColumns((prev) => {
      const sourceCol = prev.find((c) => c.id === fromColumnId);
      const task = sourceCol.tasks.find((t) => t.id === taskId);

      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });
    });
    setDraggedTask(null);
  };

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}