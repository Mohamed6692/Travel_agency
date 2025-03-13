import React, { useState, useEffect } from "react";
import axios from "axios";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm, CFormInput, CAlert } from "@coreui/react";
import { Box, Typography } from "@mui/material";
import VilleTable from "./VilleTable";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

function Ville() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ nom: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedVilleId, setSelectedVilleId] = useState(null);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVilles();
  }, []);

  const fetchVilles = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(process.env.REACT_APP_BACKEND_URL+"/api/ville/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Données des villes récupérées :", data); 
      setVilles(data.villes || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des villes :", error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom de la ville est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (ville) => {
    setFormData({ nom: ville.nom });
    setSelectedVilleId(ville._id);
    setEditMode(true);
    setVisible(true);
  };

  const handleDeleteConfirmation = (villeId) => {
    setCityToDelete(villeId);
    setDeleteModalVisible(true); // Ouvre le modal de confirmation
  };

  const handleDeleteAction = async () => {
    if (cityToDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/ville/${cityToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVilles((prevVilles) => prevVilles.filter((ville) => ville._id !== cityToDelete));
        setDeleteModalVisible(false); // Ferme le modal après la suppression
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const url = editMode ? `${process.env.REACT_APP_BACKEND_URL}/api/ville/${selectedVilleId}` : process.env.REACT_APP_BACKEND_URL+"/api/ville/create";
      const method = editMode ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Erreur lors de la requête");
  
      const result = await response.json(); // Récupère la réponse du serveur (la nouvelle ville)
  
      if (!editMode) {
        // Ajoute la nouvelle ville directement à la liste sans attendre `fetchVilles()`
        setVilles((prevVilles) => [...prevVilles, result.ville]);
      } else {
        // Met à jour la ville existante dans la liste
        setVilles((prevVilles) =>
          prevVilles.map((v) => (v._id === selectedVilleId ? result.ville : v))
        );
      }
  
      setSuccessMessage(editMode ? "Ville modifiée avec succès !" : "Ville créée avec succès !");
      setTimeout(() => {
        setSuccessMessage("");
        setVisible(false);
        setEditMode(false);
        setSelectedVilleId(null);
        setFormData({ nom: "" }); // Réinitialiser le formulaire
        setErrors({}); // Réinitialiser les erreurs
      }, 2000);
    } catch (error) {
      setErrors({ api: error.message || "Erreur lors du traitement." });
    }
  };

  return (
    <Box p={3}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Gestion des Villes
        </Typography>

        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "1rem" }}>
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Nouvelle ville <AddLocationAltIcon />
          </CButton>
        </div>
      </div>
      <Typography>Gérez vos Villes ici.</Typography>

      {/* Modal de confirmation de suppression */}
      <CModal alignment="center" visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Typography>Êtes-vous sûr de vouloir supprimer cette ville ?</Typography>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={handleDeleteAction}>
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal pour ajouter ou modifier une ville */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? "Modifier la ville" : "Ajouter une ville"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          {errors.api && <CAlert color="danger">{errors.api}</CAlert>}
          <CForm>
            <label>Nom de la Ville</label>
            <CFormInput name="nom" value={formData.nom} onChange={handleChange} />
            {errors.nom && <CAlert color="danger">{errors.nom}</CAlert>}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editMode ? "Modifier" : "Ajouter"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Liste des villes */}
      <VilleTable villes={villes} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />
    </Box>
  );
}

export default Ville;
