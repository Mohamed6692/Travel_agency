import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Modal, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";  // Importation du composant Link
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importer l'icône

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [openCodePopup, setOpenCodePopup] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // Ajout de l'état loading
  const [timeLeft, setTimeLeft] = useState(30); // État pour le compte à rebours
  const [canResend, setCanResend] = useState(false); // État pour savoir si on peut renvoyer le code

  // Fonction pour envoyer le code
  const sendCode = async () => {
    setLoading(true); // Démarrer le chargement
    setTimeLeft(30); // Réinitialiser le compte à rebours
    setCanResend(false); // Désactiver le bouton de renvoi du code
  
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Une erreur est survenue");
  
      setMessage(data.message);
      setOpenCodePopup(true); // Ouvre la popup pour entrer le code
  
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
      setMessage(error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };
  

  // Envoi initial du code
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError(true);
      setMessage("L'email est requis.");
      return;
    }
    sendCode();
  };

  // Vérification du code
  const handleVerifyCode = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activation_code: code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Code invalide");

      setVerified(true); // Si le code est bon, permettre la saisie du nouveau mot de passe
      setOpenCodePopup(false);
      setMessage("Code vérifié avec succès !");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Changement du mot de passe
  const handleResetPassword = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code, password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la réinitialisation");

      setMessage("Mot de passe réinitialisé avec succès !");
      navigate("/login"); // Rediriger vers la page de connexion
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <Box
          sx={{
            height: "1px",
            // backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-100px",
          padding: "2rem",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: "2rem",
            width: "100%",
            maxWidth: "400px",
            backdropFilter: "blur(30px)",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" textAlign="center" mb={2}>
            Mot de passe oublié
          </Typography>

          {/* Affichage des alertes */}
          {message && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity={message.includes("Erreur") ? "error" : "success"}>
                {message}
              </Alert>
            </Stack>
          )}

          {!verified ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                required
                error={error}
                helperText={error ? "Email requis" : ""}
              />
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
                  },
                }}
                disabled={loading} // Désactiver le bouton pendant le chargement
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Envoyer le code"}
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
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}>
              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="dense"
                required
              />
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                Réinitialiser le mot de passe
              </Button>
            </form>
          )}
        </Paper>
      </Box>

      {/* POPUP DE VÉRIFICATION DU CODE */}
      <Modal open={openCodePopup} onClose={() => setOpenCodePopup(false)}>
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
          <Typography variant="" mb={2} color="error">
            Entrez le code reçu
          </Typography>

          {/* Afficher le message de l'alerte */}
          {message && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity={message.includes("Erreur") ? "error" : "success"}>
                {message}
              </Alert>
            </Stack>
          )}

          {/* Compte à rebours et bouton pour renvoyer le code */}
          <Box sx={{ mt: 2 }}>
            {timeLeft > 0 ? (
              <Typography variant="body2">Temps restant: {timeLeft}s</Typography>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={sendCode}
                disabled={!canResend} // Activer seulement si le temps est écoulé
              >
                Renouveler le code
              </Button>
            )}
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <TextField
                key={index}
                type="text"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", width: "30px" }, // Réduire la largeur
                }}
                value={code[index] || ""}
                onChange={(e) => {
                  const newCode = [...code];
                  newCode[index] = e.target.value;
                  setCode(newCode.join(""));

                  // Déplacer le curseur automatiquement
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
                sx={{ maxWidth: "40px" }} // Limiter la largeur des inputs de code
              />
            ))}
          </Box>

          <Button onClick={handleVerifyCode} fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Vérifier
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ForgotPassword;
