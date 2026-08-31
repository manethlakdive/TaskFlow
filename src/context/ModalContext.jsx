import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // "login" | "register" | "profile" | null

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}