import { useState, useEffect } from "react";
import Board from "./Board";
import InviteMemberModal from "../team/InviteMemberModal";
import BoardDeadlineStatus from "./BoardDeadlineStatus";
import MemberAvatarList from "../team/MemberAvatarList";

const API_URL = "http://localhost:5001/api";

export default function MyBoardSection({ boardId, onRename, refreshKey }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addTaskSignal, setAddTaskSignal] = useState(0);

  const loadBoard = () => {
    if (!boardId) return;
    setLoading(true);
    fetch(`${API_URL}/boards/${boardId}`)
      .then((res) => res.json())
      .then((data) => setBoard(data.board))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, refreshKey]);

  return (
    <section
      className="relative -mt-10 rounded-t-[40px] overflow-hidden py-12 px-6"
      style={{ backgroundColor: "#a5b4fc" }}
    >
      {!boardId ? (
        <div className="text-center text-indigo-950/50 py-10">
          No board yet. Click "+ Create New Board" above to get started.
        </div>
      ) : loading || !board ? (
        <p className="text-indigo-950/50 text-center py-10">Loading board…</p>
      ) : (
        <>
          {/* board name + add-task/invite buttons — uda pela eka */}
          <div className="flex flex-row justify-between items-start gap-4 w-full mb-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <h2
                  onDoubleClick={() => onRename?.(board)}
                  className="text-xl font-bold text-indigo-950/70 cursor-pointer hover:scale-105 transition-transform origin-left w-fit"
                >
                  {board.name}
                </h2>
                {board.description && (
                  <div className="relative group">
                    <span className="text-indigo-950/50 hover:text-indigo-950 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </span>
                    <div className="pointer-events-none absolute left-0 top-full mt-2 w-64 max-w-xs rounded-lg bg-indigo-950 text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
                      {board.description}
                    </div>
                  </div>
                )}
              </div>
              {!board.deadline && (
                <button
                  onClick={() => onRename?.(board)}
                  className="text-xs text-indigo-950/50 hover:text-indigo-950 underline mt-1"
                >
                  + Set a deadline for this project
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <MemberAvatarList boardId={board.id} />

              <button
                onClick={() => setAddTaskSignal((n) => n + 1)}
                aria-label="Add task"
                title="Add task"
                className="w-10 h-10 rounded-full bg-white text-indigo-700 shadow flex items-center justify-center hover:bg-indigo-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>
              <button
                onClick={() => setInviteOpen(true)}
                aria-label="Invite"
                title="Invite"
                className="w-10 h-10 rounded-full bg-indigo-950 text-white shadow flex items-center justify-center hover:bg-indigo-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6" />
                  <path d="M22 11h-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* status bar eka - uda row ekata kelinma pahalin, center karala */}
          {board.deadline && (
            <div className="flex justify-center w-full mb-4">
              <BoardDeadlineStatus
                createdAt={board.createdAt}
                deadline={board.deadline}
                columns={board.columns}
              />
            </div>
          )}

          <Board board={board} setBoard={setBoard} addTaskSignal={addTaskSignal} />

          <InviteMemberModal
            isOpen={inviteOpen}
            onClose={() => setInviteOpen(false)}
            boardId={board.id}
          />
        </>
      )}
    </section>
  );
}