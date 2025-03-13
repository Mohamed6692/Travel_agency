import { createContext, useContext, useState } from "react";

export const ModalContext = createContext();

export default function ModalProvider({ children }) {
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, visible }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
