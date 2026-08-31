import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(email, password);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>

      <h2 className="text-2xl font-bold mb-6 mt-8 text-white">Login</h2>

      {errorMsg && (
        <p className="text-red-400 text-sm mb-3">{errorMsg}</p>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white py-2 rounded mt-2 transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#a5b4fc" }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#8b9cf7")}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#a5b4fc")}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm mt-4 text-gray-300">
        Don't have an account?{" "}
        <button onClick={() => openModal("register")} className="hover:underline" style={{ color: "#a5b4fc" }}>Register</button>
      </p>

      <p className="text-xs mt-6 text-gray-500">
        Test accounts: amila@example.com / maneth@example.com — password: 123456
      </p>
    </div>
  );
}