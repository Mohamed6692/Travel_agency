import "@popperjs/core";
import "bootstrap";
import Aos from "aos";
import "./index.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import "./axiosConfig"; // Active la configuration d'Axios globalement 
import App from "./App";
import FlashProvider from "./contexts/FlashProvider";
import ApiProvider from "./contexts/ApiProvider";
import UserProvider from "./contexts/UserProvider";
import ModalProvider from "./contexts/ModalProvider";
import FlashMessage from "./components/FlashMessage";

// Composant qui gère le chargement conditionnel des styles
const StyleLoader = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      import("bootstrap/dist/css/bootstrap.min.css");
      import("@coreui/coreui/dist/css/coreui.min.css");
    }
  }, [isAdmin]);

  return null; // Ce composant ne rend rien, il sert uniquement à charger les styles
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <ModalProvider>
            <StyleLoader /> {/* Charge les styles conditionnellement */}
            <FlashMessage />
            <App />
          </ModalProvider>
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  </BrowserRouter>
);

// Configuration de AOS
(() => {
  const options = {
    duration: 700,
    easing: "ease-out-quad",
    once: true,
    startEvent: "load",
    disable: "mobile",
  };
  Aos.init(options);
})();
