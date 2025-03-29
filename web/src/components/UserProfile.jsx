import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Alert, Avatar, Grid, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle, Box
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { BsLock } from "react-icons/bs";

function UserProfile() {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    telephone: "",
    id: "",
    createdAt: ""
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const [openDialog, setOpenDialog] = useState(false); // State for Dialog
  const [oldPassword, setOldPassword] = useState(""); // Old password field
  const [newPassword, setNewPassword] = useState(""); // New password field
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password field

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      navigate("/login");
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setProfile({
          email: result.user.email || "",
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          telephone: result.user.phone || "",
          id: result.user._id || "",
          createdAt: result.user.createdAt || ""
        });
      } else {
        setAlertMessage(result.message || "Erreur lors de la récupération des données");
      }
    } catch (error) {
      setAlertMessage("Une erreur s'est produite lors de la récupération des données.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/update_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setAlertMessage("Profil mis à jour avec succès !");
        setShowSuccessMessage(true);
  
        // **Mettre à jour le localStorage**
        localStorage.setItem("user", JSON.stringify(result.user));
  
        // **Forcer un rechargement de la Navbar**
        window.dispatchEvent(new Event("storage"));
  
        // Attendre 30 secondes avant de rediriger vers la page d'accueil
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate("/");
        }, 300);
      } else {
        setAlertMessage(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      setAlertMessage("Une erreur s'est produite lors de la mise à jour.");
    }
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlertMessage("Tous les champs sont requis !");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setAlertMessage("Les nouveaux mots de passe ne correspondent pas !");
      return;
    }
  
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/new_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: profile.email,
          oldPassword,
          newPassword,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setAlertMessage(result.message || "Mot de passe mis à jour avec succès !");
        setShowSuccessMessage(true);
        handleDialogClose(); // Fermer la pop-up après le succès
      } else {
        setAlertMessage(result.message || "Erreur lors de la mise à jour du mot de passe");
      }
    } catch (error) {
      setAlertMessage("Une erreur s'est produite lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <Card sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <CardContent sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: "bold", mb: 2, textAlign: "center", color: "red" }}>
              Vue du profil
            </Typography>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Avatar sx={{ width: 157, height: 156, mt: 4, ml: 4 }} />
              <div style={{ marginLeft: "1.5em" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {profile.firstName} {profile.lastName}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  ID: {profile.id ? `${profile.id.slice(0, 5)}...${profile.id.slice(-6)}` : "ID non disponible"}
                </Typography>

              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" component="div" sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              Mettre à jour le profil
            </Typography>

            {/* Affichage du message de succès avec CheckIcon */}
            {showSuccessMessage && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
                {alertMessage}
              </Alert>
            )}

            <form>
              <TextField
                label="Email"
                type="email"
                name="email"
                variant="outlined"
                size="small"
                value={profile.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Prénom"
                type="text"
                name="firstName"
                variant="outlined"
                size="small"
                value={profile.firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nom"
                type="text"
                name="lastName"
                variant="outlined"
                size="small"
                value={profile.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Téléphone"
                type="text"
                name="telephone"
                variant="outlined"
                size="small"
                value={profile.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="contained" color="primary" onClick={updateProfile}>
                  Mettre à jour
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </CardContent>

      {/* Dialog pour changer le mot de passe */}
      <Dialog open={openDialog} onClose={handleDialogClose} sx={{ maxWidth: "400px", width: "90%", margin: "auto" }}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontSize: "1rem", textAlign: "center" }}>
            Veuillez remplir le formulaire
          </Typography>
        </DialogTitle>

        {alertMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {alertMessage}
          </Alert>
        )}

        <DialogContent>
          <TextField
            fullWidth
            variant="standard"
            label="Ancien mot de passe"
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="dense"
            required
            error={oldPassword === ""}
            InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
          />
          <TextField
            fullWidth
            variant="standard"
            label="Nouveau mot de passe"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
            required
            error={newPassword === ""}
            InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
          />
          <TextField
            fullWidth
            variant="standard"
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="dense"
            required
            error={confirmPassword !== newPassword}
            helperText={confirmPassword !== newPassword ? "Les mots de passe ne correspondent pas" : ""}
            InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={handlePasswordChange} color="primary">
            Sauvegarder <i className="bi bi-floppy"></i>
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default UserProfile;
