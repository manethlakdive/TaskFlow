import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const API_URL = "http://localhost:5001/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setError("");
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      throw new Error(data.message);
    }
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    setError("");
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      throw new Error(data.message);
    }
    setUser(data.user);
    return data.user;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}