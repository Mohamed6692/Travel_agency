import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import ScrollToTop from "./components/ScrollToTop";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom"; // Ajout de Outlet
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { AlertProvider } from "./contexts/AlertContext";
import UserProfile from "./components/UserProfile";
import "./index.css";
import DashboardAdmin from "./components/DashboardAdmin";

import 'primeicons/primeicons.css'; 
import "react-datepicker/dist/react-datepicker.css";
import MethodePaiement from "./components/MethodePaiement";
import Payment from "./components/Payement/Payement";
import Completion from "./components/Payement/Completion";
import EspeceForm from "components/Payement/EspeceForm";
import PrivateRoute from "contexts/PrivateRoute";

export default function App() {
  return (
    <>
    
     <AlertProvider>
      <ApiProvider>
        <ScrollToTop />
        <Routes>
          {/* Routes avec Navbar */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/user-profile" element={<UserProfile/>}/>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/Paiement" element={<MethodePaiement/>} />
            <Route path="/Stripe" element={<Payment />} />
            <Route path="/Espece" element={<EspeceForm />} />
            <Route path="/completion" element={<Completion />} />
          </Route>

          <Route path="/admin/*" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />

          {/* Route sans Navbar */}
          <Route path="register" element={<Register />} /> {/* 🚀 Page sans Navbar */}
          <Route path="login" element={<Login />} /> {/* Page de connexion */} 
          <Route path="forgot-password" element={<ForgotPassword />} />
       
        </Routes>
      </ApiProvider>
      </AlertProvider>
    </>
  );
}