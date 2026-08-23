import { useState } from "react";

export default function InviteMemberModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">
          Invite Team Member
        </h2>

        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}