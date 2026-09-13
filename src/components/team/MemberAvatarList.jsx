import { useState, useEffect } from "react";
import { socket } from "../../lib/socket";

const API_URL = "http://localhost:5001/api";
const MAX_VISIBLE = 4;

export default function MemberAvatarList({ boardId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!boardId) return;

    const fetchMembers = () => {
      fetch(`${API_URL}/boards/${boardId}/members`)
        .then((res) => res.json())
        .then((data) => setMembers(data.members || []));
    };

    fetchMembers();

    socket.emit("board:join", boardId);
    socket.on("board:update", fetchMembers);

    return () => socket.off("board:update", fetchMembers);
  }, [boardId]);

  if (members.length === 0) return null;

  const visible = members.slice(0, MAX_VISIBLE);
  const overflow = members.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((m) => (
        <div
          key={m.id}
          title={`${m.name} (${m.email})`}
          className="relative w-9 h-9 rounded-full bg-indigo-950 text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow-sm hover:z-10 hover:scale-110 transition-transform"
        >
          {m.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {overflow > 0 && (
        <div
          title={members.slice(MAX_VISIBLE).map((m) => m.name).join(", ")}
          className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px] font-semibold border-2 border-white shadow-sm hover:z-10"
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}