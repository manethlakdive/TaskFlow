import { useState, useEffect } from "react";
import SidePanel from "../common/SidePanel";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5001/api";

export default function InviteMemberModal({ isOpen, onClose, boardId }) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [sentTo, setSentTo] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&excludeId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setResults(data.users));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, user.id]);

  const sendInvite = async (toUser) => {
    setMessage("");
    const res = await fetch(`${API_URL}/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId: user.id, toUserId: toUser.id, boardId }),
    });
    const data = await res.json();
    if (res.ok) {
      setSentTo((prev) => [...prev, toUser.id]);
      setMessage(`Invite sent to ${toUser.name}`);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

        <h2 className="text-2xl font-bold mb-6 mt-8 text-white">Invite Team Member</h2>

        <input
          className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#a5b4fc]"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {message && <p className="text-sm text-indigo-300 mb-3">{message}</p>}

        <div className="flex flex-col gap-2">
          {results.map((u) => (
            <div key={u.id} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
              <div>
                <p className="text-white text-sm">{u.name}</p>
                <p className="text-gray-400 text-xs">{u.email}</p>
              </div>
              <button
                onClick={() => sendInvite(u)}
                disabled={sentTo.includes(u.id)}
                className="text-white px-3 py-1 rounded text-xs transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#a5b4fc" }}
              >
                {sentTo.includes(u.id) ? "Sent" : "Invite"}
              </button>
            </div>
          ))}
          {query && results.length === 0 && <p className="text-gray-400 text-sm">No matching users found.</p>}
        </div>
      </div>
    </SidePanel>
  );
}