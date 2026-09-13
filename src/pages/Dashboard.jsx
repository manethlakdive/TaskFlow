import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import Hero from "../components/common/Hero";
import BoardFormModal from "../components/board/BoardFormModal";
import BoardsSidePanel from "../components/board/BoardsSidePanel";
import MyBoardSection from "../components/board/MyBoardSection";
import DateTimeDisplay from "../components/common/DateTimeDisplay";
import { useAuth } from "../context/AuthContext";
import { socket } from "../lib/socket";

const API_URL = "http://localhost:5001/api";
const LAST_BOARD_KEY = "taskflow:lastBoardId";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardsPanelOpen, setBoardsPanelOpen] = useState(false);
  const [boardsVersion, setBoardsVersion] = useState(0);

  const loadBoards = (preferredId) => {
    if (!user) return;
    fetch(`${API_URL}/boards/mine?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.boards || [];
        setBoards(list);

        const lastSeenId = localStorage.getItem(`${LAST_BOARD_KEY}:${user.id}`);
        const wanted = preferredId || activeBoardId || lastSeenId;
        const stillExists = list.some((b) => b.id === wanted);

        const nextId = stillExists ? wanted : list[0]?.id || null;
        setActiveBoardId(nextId);
        if (nextId) localStorage.setItem(`${LAST_BOARD_KEY}:${user.id}`, nextId);
        setBoardsVersion((v) => v + 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    loadBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  // socket connect wuna gaman, "kavda me user kiyala" identify karanawa,
  // ape user ta enna invite accept unoth boards list ekath refresh karanawa
  useEffect(() => {
    if (!user) return;

    socket.emit("identify", user.id);

    const handleInviteAccepted = () => loadBoards();

    socket.on("invite:accepted", handleInviteAccepted);

    return () => {
      socket.off("invite:accepted", handleInviteAccepted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectBoard = (id) => {
    setActiveBoardId(id);
    localStorage.setItem(`${LAST_BOARD_KEY}:${user.id}`, id);
    setBoardsPanelOpen(false);
  };

  const handleCreateBoard = async ({ name, description, deadline }) => {
    const res = await fetch(`${API_URL}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name, description, deadline }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreateOpen(false);
      loadBoards(data.board.id);
    }
  };

  const handleRenameBoard = async ({ name, description, deadline }) => {
    const res = await fetch(`${API_URL}/boards/${editingBoard.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, deadline }),
    });
    if (res.ok) {
      setEditingBoard(null);
      loadBoards();
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!confirm("Delete this board? This can't be undone.")) return;
    const res = await fetch(`${API_URL}/boards/${boardId}`, { method: "DELETE" });
    if (res.ok) {
      if (boardId === activeBoardId) {
        localStorage.removeItem(`${LAST_BOARD_KEY}:${user.id}`);
        setActiveBoardId(null);
      }
      loadBoards();
    }
  };

  if (!user || loading) return <p className="p-8 text-gray-400">Loading…</p>;

  return (
    <div>
      <DashboardNavbar onOpenBoards={() => setBoardsPanelOpen(true)} />

      <Hero
        greeting={`Hey, ${user?.name ?? "there"}`}
        heading="Keep Your Team in FLOW"
        rotatingTexts={["Plan", "Collaborate", "Track", "Complete"]}
        subtitle="Everything your team needs to plan work, track progress, and get things done together."
        buttonText="+ Create New Board"
        onButtonClick={() => setCreateOpen(true)}
        bottomLeft={<DateTimeDisplay />}
      />

      <MyBoardSection boardId={activeBoardId} onRename={(board) => setEditingBoard(board)} refreshKey={boardsVersion} />

      <BoardFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateBoard}
        mode="create"
      />

      <BoardFormModal
        isOpen={!!editingBoard}
        onClose={() => setEditingBoard(null)}
        onSubmit={handleRenameBoard}
        mode="edit"
        initialName={editingBoard?.name}
        initialDescription={editingBoard?.description}
        initialDeadline={editingBoard?.deadline}
      />

      <BoardsSidePanel
        isOpen={boardsPanelOpen}
        onClose={() => setBoardsPanelOpen(false)}
        boards={boards}
        onOpen={handleSelectBoard}
        onRename={(board) => {
          setBoardsPanelOpen(false);
          setEditingBoard(board);
        }}
        onDelete={handleDeleteBoard}
      />
    </div>
  );
}