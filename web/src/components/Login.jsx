import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Link, Alert } from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [alertMessage, setAlertMessage] = useState(""); // État pour gérer le message de l'alerte
  const [alertSeverity, setAlertSeverity] = useState("success"); // État pour gérer la gravité de l'alerte

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur de connexion");

      // Stocker le token et les infos utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.isAdmin);
      // Redirection après connexion réussie
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // Afficher un message de succès
      setAlertMessage("Connexion réussie !");
      setAlertSeverity("success");
    } catch (error) {
      // Afficher un message d'erreur
      setAlertMessage(error.message || "Une erreur est survenue");
      setAlertSeverity("error");
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
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Connexion <LockOpenIcon style={{ color: "#DB6845" }}/>
          </Typography>

          {/* Affichage conditionnel de l'alerte */}
          {alertMessage && (
            <Alert variant="filled" severity={alertSeverity} sx={{ marginBottom: 2 }}>
            {alertMessage}
          </Alert>
          
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              required
              error={errors.email}
              helperText={errors.email ? "Email requis" : ""}
            />

            <TextField
              fullWidth
              size="small"
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              required
              error={errors.password}
              helperText={errors.password ? "Mot de passe requis" : ""}
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
            >
              Se connecter
            </Button>


            <Typography textAlign="center" mt={2} fontSize="0.9rem">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register"  sx={{ color: "black" ,fontWeight: "bold", textDecoration: "none" }}>
                S'inscrire
              </Link>
            </Typography>
            <Typography textAlign="center" mt={2} fontSize="0.8rem">
              <Link href="/forgot-password"  sx={{ fontWeight: "bold", textDecoration: "none", color: "red" }}>
              Mot de passe oublié ?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
