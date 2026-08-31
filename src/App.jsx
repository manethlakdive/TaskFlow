import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";
import ModalRoot from "./components/modals/ModalRoot";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <ModalRoot />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;