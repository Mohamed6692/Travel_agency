import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CAlert } from "@coreui/react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Box, Typography, Switch, FormControlLabel, Grid } from '@mui/material';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { ConducteurSmartTable } from "./ConducteurSmartTable";

function Chauffeur() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    permis_numero: "",
    statut: "Disponible",
    experience: 0, // Années d'expérience
    numero_tel: "",
    documents: {
      cin: "",
      passeport: "",
    },
    isCIN: true, // Switch to toggle between CIN and Passeport
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [editMode, setEditMode] = useState(false);
  const [selectedChauffeurId, setSelectedChauffeurId] = useState(null);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null); // Socket.IO state


  useEffect(() => {
    if (!token) {
      console.error("Aucun token trouvé. Veuillez vous authentifier.");
      return;
    }
    fetchChauffeurs();
    
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL+"");
    setSocket(socketConnection);
  
    // Écoute des événements de mise à jour des chauffeurs
    socketConnection.on("chauffeur:update", (data) => {
      if (data.type === "") {
        setChauffeurs((prevChauffeurs) => [...prevChauffeurs, data.chauffeur]); // Ajout du chauffeur sans écraser l'état
      } else if (data.type === "update") {
        setChauffeurs((prevChauffeurs) => 
          prevChauffeurs.map((chauffeur) =>
            chauffeur._id === data.chauffeur._id ? data.chauffeur : chauffeur
          )
        );
      } else if (data.type === "delete") {
        setChauffeurs((prevChauffeurs) => 
          prevChauffeurs.filter((chauffeur) => chauffeur._id !== data.id)
        );
      }
    });
  
    return () => {
      socketConnection.disconnect();
    };
  }, [token]);
  

// Fonction pour récupérer les chauffeurs
const fetchChauffeurs = async () => {
  setLoading(true);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}: ${
          (await response.json()).message || "Une erreur est survenue"
        }`
      );
    }

    const data = await response.json();
    setChauffeurs(data.Chauffeurs || []);
  } catch (error) {
    console.error("Erreur lors de la récupération des chauffeurs :", error);
  }
  setLoading(false);
};

  // Fonction pour rafraîchir la table des chauffeurs
  const refreshTable = () => {
    fetchChauffeurs();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith("documents.")) {
      const field = name.split(".")[1]; // Récupère "cin" ou "passeport"
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const validateForm = () => {
    let newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!formData.permis_numero.trim()) newErrors.permis_numero = "Le numéro de permis est requis.";
    if (formData.experience <= 0) newErrors.experience = "L'expérience est requise.";
    if (!formData.numero_tel.trim()) newErrors.numero_tel = "Le numéro de téléphone est requis.";
   // Validation dynamique CIN/Passeport
    if (formData.isCIN && !formData.documents.cin.trim()) newErrors.cin = "Le CIN est requis.";
    if (!formData.isCIN && !formData.documents.passeport.trim()) newErrors.passeport = "Le passeport est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (chauffeur) => {
    setFormData({
      nom: chauffeur.nom,
      prenom: chauffeur.prenom,
      permis_numero: chauffeur.permis_numero,
      statut: chauffeur.statut,
      experience: chauffeur.experience,
      numero_tel: chauffeur.numero_tel,
      documents: chauffeur.documents,
      isCIN: chauffeur.documents.cin ? true : false, // Determine if CIN or passport is provided
    });
    setSelectedChauffeurId(chauffeur._id);
    setEditMode(true);
    setVisible(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!token) {
      setErrors({ api: "Authentification requise. Veuillez vous reconnecter." });
      return;
    }
  
    try {
      const url = editMode
        ? `${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/${selectedChauffeurId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/create`;
      
      const method = editMode ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(
          `Erreur HTTP ${response.status}: ${
            (await response.json()).message || "Une erreur est survenue"
          }`
        );
      }
  
      const data = await response.json();
  
      if (data.success) {
        setSuccessMessage(editMode ? "Chauffeur modifié avec succès !" : "Chauffeur créé avec succès !");
        
        // Réinitialisation du formulaire
        setFormData({
          nom: "",
          prenom: "",
          permis_numero: "",
          statut: "Disponible",
          experience: 0,
          numero_tel: "",
          documents: { cin: "", passeport: "" },
          isCIN: true,
        });
  
        setTimeout(() => {
          setSuccessMessage("");
          setVisible(false);
          setEditMode(false);
          setSelectedChauffeurId(null);
          refreshTable(); // Met à jour la liste des chauffeurs après modification
        }, 2000);
      }
    } catch (error) {
      setErrors({
        api: error.message || "Erreur lors du traitement.",
      });
    }
  };
  

  return (
    <Box p={3}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", letterSpacing: "0.5px" }}>
          Chauffeurs
        </Typography>
        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Nouveau Chauffeur <AirlineSeatReclineNormalIcon />
          </CButton>
        </div>
      </div>
      <Typography>Gérez vos chauffeurs ici.</Typography>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)} aria-labelledby="ChauffeurModal" >
        <CModalHeader>
          <CModalTitle id="ChauffeurModal" style={{ fontSize: "1rem", fontWeight: "bold", color: "rgb(31, 140, 58)", textAlign: "center", width: "100%" }}>
            {editMode ? "Modifier le chauffeur" : "Ajout d'un chauffeur"} <AirlineSeatReclineNormalIcon />
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {successMessage && <CAlert color="success" style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>{successMessage}</CAlert>}
          {errors.api && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>{errors.api}</CAlert>}

          <CForm>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label>Nom <span style={{ color: "red" }}>*</span></label>
                <CFormInput type="text" name="nom" placeholder="Entrez le nom" value={formData.nom} onChange={handleChange} />
                {errors.nom && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.nom}</CAlert>}
              </Grid>

              <Grid item xs={6}>
                <label>Prénom <span style={{ color: "red" }}>*</span></label>
                <CFormInput type="text" name="prenom" placeholder="Entrez le prénom" value={formData.prenom} onChange={handleChange} />
                {errors.prenom && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.prenom}</CAlert>}
              </Grid>

              <Grid item xs={6}>
                <label>Numéro de permis <span style={{ color: "red" }}>*</span></label>
                <CFormInput type="text" name="permis_numero" placeholder="Entrez le numéro de permis" value={formData.permis_numero} onChange={handleChange} />
                {errors.permis_numero && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.permis_numero}</CAlert>}
              </Grid>

              <Grid item xs={6}>
                <label>Années d'expérience <span style={{ color: "red" }}>*</span></label>
                <CFormInput type="number" name="experience" placeholder="Entrez les années d'expérience" value={formData.experience} onChange={handleChange} />
                {errors.experience && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.experience}</CAlert>}
              </Grid>

              <Grid item xs={6}>
              <FormControlLabel
                  control={<Switch checked={!formData.isCIN} onChange={() => setFormData((prev) => ({ ...prev, isCIN: !prev.isCIN }))} />}
                  label="Utiliser Passeport"
                />
              </Grid>

              {formData.isCIN ? (
                <Grid item xs={6}>
                  <label>CIN <span style={{ color: "red" }}>*</span></label>
                  <CFormInput 
                    type="text" 
                    name="documents.cin" 
                    placeholder="Entrez le CIN" 
                    value={formData.documents.cin} 
                    onChange={handleChange} 
                  />
                  {errors.cin && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.cin}</CAlert>}
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <label>Passeport <span style={{ color: "red" }}>*</span></label>
                  <CFormInput 
                    type="text" 
                    name="documents.passeport" 
                    placeholder="Entrez le numéro de passeport" 
                    value={formData.documents.passeport} 
                    onChange={handleChange} 
                  />
                  {errors.passeport && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.passeport}</CAlert>}
                </Grid>
              )}


              <Grid item xs={6}>
                <label>Numéro de téléphone <span style={{ color: "red" }}>*</span></label>
                <CFormInput type="text" name="numero_tel" placeholder="Entrez le numéro de téléphone" value={formData.numero_tel} onChange={handleChange} />
                {errors.numero_tel && <CAlert color="danger" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{errors.numero_tel}</CAlert>}
              </Grid>

            </Grid>
          </CForm>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Fermer</CButton>
          <CButton color="primary" onClick={handleSubmit}>{editMode ? "Modifier" : "Sauvegarder"}</CButton>
        </CModalFooter>
      </CModal>
      <ConducteurSmartTable onEdit={handleEdit} refreshTable={refreshTable} chauffeur={chauffeurs} loading={loading}/>
    </Box>
  );
}

export default Chauffeur;
