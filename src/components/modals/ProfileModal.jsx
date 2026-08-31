import { useAuth } from "../../context/AuthContext";

export default function ProfileModal({ onClose }) {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

      <h2 className="text-2xl font-bold mb-6 mt-8 text-white">My Profile</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl" style={{ backgroundColor: "#a5b4fc" }}>
          {user?.name?.charAt(0) ?? "?"}
        </div>
        <div>
          <p className="font-semibold text-white">{user?.name ?? "Guest"}</p>
          <p className="text-sm text-gray-300">{user?.email ?? ""}</p>
        </div>
      </div>

      <button className="text-white px-4 py-2 rounded self-start transition-colors" style={{ backgroundColor: "#a5b4fc" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#8b9cf7"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#a5b4fc"}>
        Edit Profile
      </button>
    </div>
  );
}