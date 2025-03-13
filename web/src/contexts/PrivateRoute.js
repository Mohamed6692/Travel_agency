import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Vérifier si un token d'authentification existe
  const token = localStorage.getItem("token");
  //const userRole = JSON.parse(localStorage.getItem("userRole")); // Convertir en booléen
  const userRole = localStorage.getItem("userRole") === "true";
  // Si pas de token ou si userRole n'est pas true, rediriger vers la page de login
  if (!token || !userRole) {
    return <Navigate to="/login" />;
  }

  return children; // Si authentifié et admin, rendre le composant enfant (la route protégée)
};

export default PrivateRoute;
