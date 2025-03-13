import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CFormSelect, CAlert } from "@coreui/react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { VehiculeSmartTable } from "./VehiculeSmartTable";
import { Box, Typography } from '@mui/material';

function Vehicule() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    capacite: 0,
    statut: "Disponible",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [editMode, setEditMode] = useState(false);
  const [selectedVehiculeId, setSelectedVehiculeId] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.error("Aucun token trouvé. Veuillez vous authentifier.");
      return;
    }
  }, [token]);

  // Fonction pour récupérer les véhicules
  const fetchVehicules = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(process.env.REACT_APP_BACKEND_URL+"/api/vehicule/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setVehicules(data.vehicules || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    }
    setLoading(false);
  };

  // Fonction pour rafraîchir la table des véhicules
  const refreshTable = () => {
    fetchVehicules();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacite" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.immatriculation.trim()) newErrors.immatriculation = "L'immatriculation est requise.";
    if (!formData.marque.trim()) newErrors.marque = "La marque est requise.";
    if (!formData.modele.trim()) newErrors.modele = "Le modèle est requis.";
    if (formData.capacite < 6 || formData.capacite > 49) {
      newErrors.capacite = "La capacité doit être entre 6 et 49 places.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (vehicule) => {
    setFormData({
      immatriculation: vehicule.immatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      capacite: vehicule.capacite,
      statut: vehicule.statut,
    });
    setSelectedVehiculeId(vehicule._id);
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
        ? `${process.env.REACT_APP_BACKEND_URL}/api/vehicule/${selectedVehiculeId}`
        : process.env.REACT_APP_BACKEND_URL+"/api/vehicule/create";

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          capacite: Number(formData.capacite),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la requête");
      }

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(editMode ? "Véhicule modifié avec succès !" : "Véhicule créé avec succès !");
        setFormData({
          immatriculation: "",
          marque: "",
          modele: "",
          capacite: "",
          statut: "Disponible",
        });

        setTimeout(() => {
          setSuccessMessage("");
          setVisible(false);
          setEditMode(false);
          setSelectedVehiculeId(null);
          refreshTable(); 
         
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", letterSpacing: "0.5px", }}>
        Véhicules
      </Typography>

        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Nouveau Véhicule <DirectionsBusIcon />
          </CButton>
        </div>
      </div>
      <Typography>Gérez vos véhicules ici.</Typography>

      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)} aria-labelledby="VehiculeModal">
        <CModalHeader>
          <CModalTitle id="VehiculeModal" style={{ fontSize: "1rem", fontWeight: "bold", color: "rgb(31, 140, 58)", textAlign: "center", width: "100%" }}>
            {editMode ? "Modifier le véhicule" : "Ajout d'un véhicule"} <DirectionsBusIcon />
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          {errors.api && <CAlert color="danger">{errors.api}</CAlert>}

          <CForm>
            <label>Immatriculation <span style={{ color: "red" }}>*</span></label>
            <CFormInput type="text" name="immatriculation" placeholder="Entrez l'immatriculation" value={formData.immatriculation} onChange={handleChange} />
            {errors.immatriculation && <CAlert color="danger">{errors.immatriculation}</CAlert>}

            <label className="mt-3">Marque <span style={{ color: "red" }}>*</span></label>
            <CFormInput type="text" name="marque" placeholder="Entrez la marque du véhicule" value={formData.marque} onChange={handleChange} />
            {errors.marque && <CAlert color="danger">{errors.marque}</CAlert>}

            <label className="mt-3">Modèle <span style={{ color: "red" }}>*</span></label>
            <CFormSelect name="modele" value={formData.modele} onChange={handleChange}>
              <option value="">Sélectionner un modèle</option>
              <option value="Car">Car</option>
              <option value="Mini Car">Mini Car</option>
              <option value="Autres">Autres</option>
            </CFormSelect>

            <label className="mt-3">Capacité <span style={{ color: "red" }}>*</span></label>
            <CFormInput type="number" name="capacite" placeholder="Nombre de places" min="6" max="49" value={formData.capacite} onChange={handleChange} />
            {errors.capacite && <CAlert color="danger">{errors.capacite}</CAlert>}
          </CForm>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Fermer</CButton>
          <CButton color="primary" onClick={handleSubmit}>{editMode ? "Modifier" : "Sauvegarder"}</CButton>
        </CModalFooter>
      </CModal>

      <VehiculeSmartTable onEdit={handleEdit} refreshTable={refreshTable} vehicules={vehicules} loading={loading} />
    </Box>
  );
}

export default Vehicule;
