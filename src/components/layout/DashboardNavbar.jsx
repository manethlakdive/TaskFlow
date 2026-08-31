import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import PillNav from "../effects/PillNav/PillNav";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "My Boards", href: "#", onClick: () => {} },
    { label: "Profile", href: "#", onClick: () => openModal("profile") },
    { label: "Logout", href: "#", onClick: handleLogout },
  ];

  return (
    <PillNav
  logo="/logo.png"
  logoAlt="TaskFlow"
  items={navItems}
  baseColor="#a5b4fc"
  pillColor="rgba(255, 255, 255, 0.1)"
  hoveredPillTextColor="#1e1b4b"
  pillTextColor="#ffffff"
/>
  );
}
