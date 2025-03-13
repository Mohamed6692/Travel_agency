import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CAlert } from "@coreui/react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {Box, TextField, Button, Paper, Grid,Modal,CircularProgress,FormControlLabel,Switch,Typography} from "@mui/material";
import "react-phone-input-2/lib/material.css";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";  // Importation du composant Link
import "react-phone-input-2/lib/material.css"; // Inutile si tu utilises `react-international-phone`
import { useAlert } from "contexts/AlertContext";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importer l'icône
import AdminSmartTable from "./AdminSmartTable";


function Admin() {
const [visible, setVisible] = useState(false);
const [errors, setErrors] = useState({});
const [successMessage, setSuccessMessage] = useState("");
const [token, setToken] = useState(localStorage.getItem("token"));
const [editMode, setEditMode] = useState(false);
const [loading, setLoading] = useState(false);
const [socket, setSocket] = useState(null); // Socket.IO state
const navigate = useNavigate();
const [activationCode, setActivationCode] = useState("");
const [isVerificationOpen, setIsVerificationOpen] = useState(false);
const [verificationMessage, setVerificationMessage] = useState("");
const [verified, setVerified] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [timeLeft, setTimeLeft] = useState(30); // État pour le compte à rebours
const [canResend, setCanResend] = useState(false); // État pour savoir si on peut renvoyer le code
const [message, setMessage] = useState("");
const [code, setCode] = useState([]);
const { setAlert } = useAlert();
const [otpError, setOtpError] = useState("");  // État pour l'erreur OTP

const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [userData, setUserData] = useState(null);  // Enregistrer les données de l'utilisateur avant vérification

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, phone });
  };

  // Enregistrer les données de l'utilisateur sans les ajouter à la base de données
  const handleRegister = async () => {
    setLoading(true);
    setTimeLeft(30); 
    setCanResend(false); 
    console.log("FormData:", formData);
    // Validation Checks
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmpassword) {
        setAlert({ open: true, message: "Tous les champs sont requis.", severity: "error" });
        setLoading(false);
        return;
    }
    console.log("FormData:", formData);
    if (formData.password !== formData.confirmpassword) {
        setAlert({ open: true, message: "Les mots de passe ne correspondent pas.", severity: "error" });
        setLoading(false);
        return;
      }
    console.log("FormData:", formData);
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setAlert({ open: true, message: "Veuillez entrer un email valide.", severity: "error" });
        setLoading(false);
        return;
    }
    console.log("FormData:", formData);


    
    setErrorMessage("");
    console.log("try")
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();
        console.log("data",data)
        if (!response.ok) throw new Error(data.message);

        // Save user data locally before verification
        setUserData({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            activationToken: data.activationToken,
        });

        setAlert({ open: true, message: "Inscription réussie ! Veuillez vérifier votre compte.", severity: "success" });
        setIsVerificationOpen(true);
        setMessage(data.message);

        // Countdown logic
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

    } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
    } finally {
        setLoading(false);
    }
};


  // Vérification du code d'activation
  const handleVerification = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activation_code: code,
          activation_token: userData.activationToken
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Si la réponse n'est pas correcte, on affiche une erreur
        setOtpError(data.message || "Code OTP incorrect.");
        setAlert({ open: true, message: data.message || "Code OTP incorrect.", severity: "error" });
        return;
      }
  
      // Si le code OTP est correct
      localStorage.setItem("user", JSON.stringify({ token: data.token }));
  
      setAlert({ open: true, message: "Votre compte a été activé avec succès !", severity: "success" });
  
      setIsVerificationOpen(false); // Ferme la boîte de dialogue après la vérification
      //  navigate("/login"); Redirige l'utilisateur après la vérification
       setVisible(false);
    } catch (error) {
      setOtpError("Une erreur est survenue lors de la vérification du code OTP.");
      setAlert({ open: true, message: "Une erreur est survenue lors de la vérification du code OTP.", severity: "error" });
    }
  };
  
  

  return (
    <Box p={3}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", letterSpacing: "0.5px" }}>
          Administrateurs
        </Typography>
        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Nouveau Admin <ManageAccountsIcon />
          </CButton>
        </div>
      </div>
      <Typography>Gérez vos admin ici.</Typography>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)} aria-labelledby="ChauffeurModal"
      size="md"  >
         <CModalHeader>
          <CModalTitle id="ChauffeurModal" style={{ fontSize: "1rem", fontWeight: "bold", color: "rgb(31, 140, 58)", textAlign: "center", width: "100%" }}>
            {editMode ? "Modifier le Admin" : "Ajout d'un Admin"} <ManageAccountsIcon />
          </CModalTitle>
        </CModalHeader>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center", padding: "2rem" }}>
   

          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <PhoneInput defaultCountry="ci" international={true} value={formData.phone} onChange={handlePhoneChange} inputProps={{ name: "phone", required: true, autoFocus: true, style: { width: '100%' } }} />
            </Box>

            <TextField fullWidth size="small" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} margin="dense" required />
            <TextField fullWidth size="small" label="Mot de passe" type="password" name="password" value={formData.password} onChange={handleChange} margin="dense" required />
            <TextField fullWidth size="small" label="Confirmez le mot de passe" type="password" name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} margin="dense" required />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={loading} // Désactiver le bouton pendant le chargement
              >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Enregistrer"}
            </Button>
          </form>
     
      </Box>

      {/* Dialog for OTP verification */}
      <Modal open={isVerificationOpen} onClose={() => setIsVerificationOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" mb={2} color="error">Vérification OTP</Typography>
        
        {message && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="info">{message}</Alert>
          </Stack>
        )}

        <Box sx={{ mt: 2 }}>
          {timeLeft > 0 ? (
            <Typography variant="body2">Temps restant: {timeLeft}s</Typography>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRegister}
              disabled={!canResend}
            >
              Renouveler le code
            </Button>
          )}
        </Box>
        
        {otpError && (
          <Stack sx={{ width: '100%', marginTop: 2 }} spacing={2}>
            <Alert severity="error">{otpError}</Alert>
          </Stack>
          )}

        <Box display="flex" justifyContent="center" gap={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <TextField
              key={index}
              type="text"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", width: "30px" },
              }}
              value={code[index] || ""}
              onChange={(e) => {
                const newCode = [...code];
                newCode[index] = e.target.value;
                setCode(newCode.join(""));

                if (e.target.value && index < 3) {
                  document.getElementById(`otp-input-${index + 1}`)?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[index] && index > 0) {
                  document.getElementById(`otp-input-${index - 1}`)?.focus();
                }
              }}
              id={`otp-input-${index}`}
              margin="dense"
              required
              sx={{ maxWidth: "40px" }}
            />
          ))}
        </Box>

        <DialogActions>
          <Button onClick={() => setIsVerificationOpen(false)} color="secondary">Annuler</Button>
          <Button onClick={handleVerification} color="primary">Vérifier</Button>
        </DialogActions>
      </Box>
      </Modal>
      </CModal>


      {/* table */}
      <AdminSmartTable/>


    </Box>
  )
}

export default Admin