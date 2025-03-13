import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper, Grid,Modal,CircularProgress} from "@mui/material";
import "react-phone-input-2/lib/material.css";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Link } from "react-router-dom";  // Importation du composant Link
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importer l'icône
import "react-phone-input-2/lib/material.css"; // Inutile si tu utilises `react-international-phone`
import { useAlert } from "../contexts/AlertContext";
import LockPersonIcon from '@mui/icons-material/LockPerson';

const Register = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState("");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Ajout de l'état loading
  const [timeLeft, setTimeLeft] = useState(30); // État pour le compte à rebours
  const [canResend, setCanResend] = useState(false); // État pour savoir si on peut renvoyer le code
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [code, setCode] = useState([]);
  const { setAlert } = useAlert();
  const [otpError, setOtpError] = useState("");  // État pour l'erreur OTP
  // État pour gérer le message de l'alerte
  const [alertSeverity, setAlertSeverity] = useState("success"); // État pour gérer la gravité de l'alerte
  

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
    setLoading(true); // Démarrer le chargement
    setTimeLeft(30); // Réinitialiser le compte à rebours
    setCanResend(false); // Désactiver le bouton de renvoi du code
  
    
  if (formData.password !== formData.confirmpassword) {
    setAlert({ open: true, message: "Les mots de passe ne correspondent pas.", severity: "error" });
    setLoading(false);
    return;
  }
  
    setErrorMessage("");
    
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
      if (!response.ok) throw new Error(data.message || "Erreur de connexion");
      

      // Enregistrer les données localement avant vérification
      setUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        activationToken:data.activationToken
      });

      setAlert({ open: true, message: "Inscription réussie ! Veuillez vérifier votre compte.", severity: "success" });
      setAlertMessage("Inscription réussie ! Veuillez vérifier votre compte !");
      setAlertSeverity("success");
      setIsVerificationOpen(true);
      setMessage(data.message);
      // Démarre le compte à rebours
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // Arrête le compte à rebours
            setCanResend(true); // Permet de renvoyer le code
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Décrémenter chaque seconde

      } catch (error) {
        setAlert({ open: true, message: error.message, severity: "error" });
        setAlertMessage(error.message || "Une erreur est survenue");
        setAlertSeverity("error");
      } finally {
        setLoading(false); // Fin du chargement
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
      navigate("/login"); // Redirige l'utilisateur après la vérification
    } catch (error) {
      setOtpError("Une erreur est survenue lors de la vérification du code OTP.");
      setAlert({ open: true, message: "Une erreur est survenue lors de la vérification du code OTP.", severity: "error" });
    }
  };
  
  

  return (
    <>
      {alert.open && (
        <Stack 
          sx={{ 
            width: '100%', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }} 
          spacing={2}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Stack>
      )}

      <Box
       sx={{ 
         height: "1px",
        //  backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')",
         backgroundSize: "cover",
         backgroundPosition: "center" 
        }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "5rem", // Espacement sous l'image
            marginTop: "7rem",
          }}
        >
          <img
            src="img/logoraf.jpg"
            alt="Logo"
            style={{
              maxWidth: "10rem", // Limite la largeur de l'image à 200px
              height: "auto", // Maintient le ratio de l'image
            }}
          />
        </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-100px", padding: "2rem" }}>
        <Paper elevation={5} sx={{ padding: "2rem", width: "100%", maxWidth: "700px", backdropFilter: "blur(30px)", borderRadius: "10px" }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>Inscription <LockPersonIcon style={{ color: "#DB6845" }}/></Typography>
          {/* Affichage conditionnel de l'alerte */}
          {alertMessage && (
            <Alert variant="filled" severity={alertSeverity} sx={{ marginBottom: 2 }}>
            {alertMessage}
          </Alert>
          
          )}

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
                sx={{
                  mt: 2,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  padding: "0.5rem",
                  backgroundColor: "#DB6845", // Couleur orange
                  "&:hover": {
                    backgroundColor: "#ff8c00", // Couleur orange plus foncé au survol
                  },}}
                disabled={loading} // Désactiver le bouton pendant le chargement
              >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "S'inscrire"}
            </Button>

            {/* Lien retour au login */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: loading ? "gray" : "black", // Désactiver le lien en changeant la couleur
                      pointerEvents: loading ? "none" : "auto", // Empêcher l'interaction avec le lien si en chargement
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <ArrowBackIcon fontSize="small" /> Retour à la connexion
                  </Link>
                </Typography>
              </Box>
          </form>
        </Paper>
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
    </>
  );
};

export default Register;