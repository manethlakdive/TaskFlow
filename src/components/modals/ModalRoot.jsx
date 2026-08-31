import { useModal } from "../../context/ModalContext";
import SidePanel from "../common/SidePanel";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import ProfileModal from "./ProfileModal";

export default function ModalRoot() {
  const { activeModal, closeModal } = useModal();

  return (
    <SidePanel isOpen={!!activeModal} onClose={closeModal}>
      {activeModal === "login" && <LoginModal onClose={closeModal} />}
      {activeModal === "register" && <RegisterModal onClose={closeModal} />}
      {activeModal === "profile" && <ProfileModal onClose={closeModal} />}
    </SidePanel>
  );
}