import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    token: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    token: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token, password } = formData;

    if (!token || !password) {
      setErrors({
        token: !token,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Une erreur est survenue");

      alert("Mot de passe réinitialisé avec succès !");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={5} sx={{ padding: "2rem", width: "100%", maxWidth: "400px" }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Réinitialisation du mot de passe
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Code de vérification"
            name="token"
            value={formData.token}
            onChange={handleChange}
            margin="dense"
            required
            error={errors.token}
            helperText={errors.token ? "Code requis" : ""}
          />

          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="dense"
            required
            error={errors.password}
            helperText={errors.password ? "Mot de passe requis" : ""}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            Réinitialiser
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
