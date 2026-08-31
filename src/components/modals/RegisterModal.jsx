import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";

export default function RegisterModal({ onClose }) {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-white text-lg leading-none" aria-label="Close">✕</button>
      <h2 className="text-2xl font-bold mb-6 mt-8 text-white">Create Account</h2>

      {errorMsg && <p className="text-red-400 text-sm mb-2">{errorMsg}</p>}

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-[#a5b4fc]" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full text-white py-2 rounded mt-2 transition-colors" style={{ backgroundColor: "#a5b4fc" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#8b9cf7"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#a5b4fc"}>
          Register
        </button>
      </form>

      <p className="text-sm mt-4 text-gray-300">
        Already have an account?{" "}
        <button type="button" onClick={() => openModal("login")} className="hover:underline" style={{ color: "#a5b4fc" }}>Login</button>
      </p>
    </div>
  );
}