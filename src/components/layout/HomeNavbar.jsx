import { useModal } from "../../context/ModalContext";
import PillNav from "../effects/PillNav/PillNav";

export default function HomeNavbar() {
  const { openModal } = useModal();

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: "About", href: "#", onClick: scrollToAbout },
    { label: "Login", href: "#", onClick: () => openModal("login") },
    { label: "Register", href: "#", onClick: () => openModal("register") },
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
