import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5001/api";

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/invites/mine?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setInvites(data.invites));
  }, [user]);

  const respond = async (inviteId, action) => {
    const res = await fetch(`${API_URL}/invites/${inviteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  return (
    <div className="relative z-[100] w-full h-full flex items-center justify-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-white/90 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <BellIcon />
        {invites.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] leading-none rounded-full w-3.5 h-3.5 flex items-center justify-center">
            {invites.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-72 bg-slate-900 border border-white/10 rounded-lg shadow-lg p-3 z-[100]">
          {invites.length === 0 ? (
            <p className="text-gray-400 text-sm">No new invites</p>
          ) : (
            invites.map((inv) => (
              <div key={inv.id} className="flex flex-col gap-2 border-b border-white/10 py-2 last:border-0">
                <p className="text-sm text-white">
                  <span className="font-semibold">{inv.fromUser?.name}</span> invited you to{" "}
                  <span className="font-semibold">{inv.board?.name}</span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => respond(inv.id, "accept")} className="text-xs bg-indigo-500 text-white px-2 py-1 rounded">
                    Accept
                  </button>
                  <button onClick={() => respond(inv.id, "reject")} className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}