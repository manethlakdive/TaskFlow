import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { socket } from "../../lib/socket";

const API_URL = "http://localhost:5001/api";

const COLUMN_LABELS = {
  "To Do": "PLAN",
  "Doing": "IN PROGRESS",
  "Done": "COMPLETED",
};

export default function Board({ board, setBoard, addTaskSignal }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  useEffect(() => {
    if (addTaskSignal) {
      setActiveTask(null);
      setTaskModalOpen(true);
    }
  }, [addTaskSignal]);

  // me board eke room ekata join wela, wena kenek e board eka edit kalama
  // live update ekak enawa, setBoard karanawa - screen eka auto refresh wenawa
  useEffect(() => {
    if (!board?.id) return;

    socket.emit("board:join", board.id);

    const handleBoardUpdate = (updatedBoard) => {
      if (updatedBoard.id === board.id) setBoard(updatedBoard);
    };

    socket.on("board:update", handleBoardUpdate);

    return () => {
      socket.emit("board:leave", board.id);
      socket.off("board:update", handleBoardUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board?.id]);

  const refresh = (data) => {
    if (data?.board) setBoard(data.board);
  };

  const openEditTask = (task) => {
    setActiveTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async ({ title, description }) => {
    const res = activeTask
      ? await fetch(`${API_URL}/boards/${board.id}/tasks/${activeTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        })
      : await fetch(`${API_URL}/boards/${board.id}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
    refresh(await res.json());
    setTaskModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    const res = await fetch(`${API_URL}/boards/${board.id}/tasks/${taskId}`, { method: "DELETE" });
    refresh(await res.json());
    setTaskModalOpen(false);
  };

  const handleDragStart = (taskId, fromColumnId) => setDraggedTask({ taskId, fromColumnId });

  const handleDrop = async (toColumnId) => {
    setDragOverColumnId(null);
    if (!draggedTask) return;
    const { taskId, fromColumnId } = draggedTask;
    setDraggedTask(null);
    if (fromColumnId === toColumnId) return;

    const res = await fetch(`${API_URL}/boards/${board.id}/tasks/${taskId}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toColumnId }),
    });
    refresh(await res.json());
  };

  return (
    <>
      <div className="p-4 px-6 md:px-10 flex gap-4 flex-wrap md:flex-nowrap">
        {board.columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverColumnId !== column.id) setDragOverColumnId(column.id);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget)) return;
              setDragOverColumnId((prev) => (prev === column.id ? null : prev));
            }}
            onDrop={() => handleDrop(column.id)}
            className={`flex-1 min-w-[288px] rounded-[25px] border p-4 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.03] ${
              dragOverColumnId === column.id
                ? "scale-[1.08] border-indigo-400"
                : "border-white/10"
            }`}
            style={{ minHeight: 420, backgroundColor: "rgba(18, 15, 23, 0.85)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">
                {COLUMN_LABELS[column.title] || column.title}
              </h3>
              <span className="text-white/40 text-xs bg-white/10 rounded-full px-2 py-0.5">
                {column.tasks.length}
              </span>
            </div>
            <div>
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  onDragStart={handleDragStart}
                  onOpen={openEditTask}
                />
              ))}
              {column.tasks.length === 0 && <p className="text-white/30 text-xs">No tasks</p>}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        task={activeTask}
      />
    </>
  );
}