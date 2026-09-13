import { useState, useEffect } from "react";
import Board from "./Board";
import InviteMemberModal from "../team/InviteMemberModal";
import BoardFormModal from "./BoardFormModal";

const API_URL = "http://localhost:5001/api";

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [addTaskSignal, setAddTaskSignal] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/boards/${boardId}`)
      .then((res) => res.json())
      .then((data) => setBoard(data.board))
      .finally(() => setLoading(false));
  }, [boardId]);

  const handleRenameSubmit = async ({ name, description }) => {
    const res = await fetch(`${API_URL}/boards/${boardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    setBoard((prev) => ({ ...prev, ...data.board }));
    setRenameOpen(false);
  };

  if (loading || !board) return <p className="p-8 text-gray-400">Loading board…</p>;

  return (
    <div>
      <div className="flex justify-between items-center px-4 pt-6">
        <div>
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 mb-1">← My Boards</button>
          <h2
            onClick={() => {
              alert("clicked!");
              setRenameOpen(true);
            }}
            className="text-xl font-bold text-gray-800 cursor-pointer hover:underline w-fit"
          >
            {board.name}
          </h2>
          {board.description && <p className="text-sm text-gray-500">{board.description}</p>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAddTaskSignal((n) => n + 1)}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700"
          >
            + Add Task
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-50"
          >
            + Invite
          </button>
        </div>
      </div>

      <Board board={board} setBoard={setBoard} addTaskSignal={addTaskSignal} />
      <InviteMemberModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} boardId={board.id} />
      <BoardFormModal
        isOpen={renameOpen}
        onClose={() => setRenameOpen(false)}
        onSubmit={handleRenameSubmit}
        mode="edit"
        initialName={board.name}
        initialDescription={board.description}
      />
    </div>
  );
}