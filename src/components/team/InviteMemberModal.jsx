import { useState } from "react";
import SidePanel from "../common/SidePanel";

export default function InviteMemberModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");

  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <div className="h-full flex flex-col p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

        <h2 className="text-2xl font-bold mb-6 mt-8 text-white">Invite Team Member</h2>

        <input
          className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#a5b4fc]"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="text-white px-4 py-2 rounded self-start transition-colors"
          style={{ backgroundColor: "#a5b4fc" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8b9cf7")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a5b4fc")}
        >
          Send Invite
        </button>
      </div>
    </SidePanel>
  );
}