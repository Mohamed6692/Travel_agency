import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { CButton, CModal, CModalBody, CModalFooter, CFormSelect, CModalHeader, CModalTitle, CForm, CFormInput, CAlert } from "@coreui/react";
import { Box, Typography, Grid } from "@mui/material"; // Ajout de Grid
import {TrajetSmartTable} from "./TrajetSmartTable";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';


// const socket = io(process.env.REACT_APP_BACKEND_URL+"");
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

function Trajet() {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    origine: "", 
    destination: "", 
    distance: 0,
    prix: 0,
    type_transport: "",
    horaire_depart: "00:00",
    horaire_arrivee: "00:00",
    chauffeur_id: "",  // 🚨 Ajout
    vehicule_id: ""   // 🚨 Ajout
  });
  

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedTrajetId, setSelectedTrajetId] = useState(null);
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [trajetToDelete, setTrajetToDelete] = useState(null);
  const [chauffeurs, setChauffeurs] = useState([]); 
  const [vehicules, setVehicules] = useState([]); 
  const [villes, setVilles] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTrajets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
  
      const data = await response.json();
      setTrajets(data.trajets || []);
      console.log("Trajets récupérés :", data.trajets);
    } catch (error) {
      console.error("Erreur lors de la récupération des trajets :", error);
    }
    setLoading(false);
  }, []);
  

  const fetchVilles = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ville/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
  
      const data = await response.json();
      setVilles(data.villes || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des villes :", error);
    }
  }, []);
  

  const fetchConducteurs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
  
      const data = await response.json();
  
      if (editMode) {
        setChauffeurs(data.chauffeurs || []); // 🔥 Tous les chauffeurs en mode édition
      } else {
        const chauffeursDisponibles = data.chauffeurs.filter(chauffeur => chauffeur.statut === "Disponible");
        setChauffeurs(chauffeursDisponibles || []); // 🔥 Seulement les disponibles en mode ajout
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des chauffeurs :", error);
    }
    setLoading(false);
  }, [editMode]); // 🔥 Ajout de `editMode` dans les dépendances
  

  const fetchVehicules = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/vehicule/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
  
      const data = await response.json();
  
      if (editMode) {
        setVehicules(data.vehicules || []); // 🔥 Tous les véhicules en mode édition
      } else {
        const vehiculesDisponibles = data.vehicules.filter(vehicule => vehicule.statut === "Disponible");
        setVehicules(vehiculesDisponibles || []); // 🔥 Seulement les disponibles en mode ajout
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    }
    setLoading(false);
  }, [editMode]); // 🔥 Ajout de `editMode` dans les dépendances

  
  useEffect(() => {
    fetchTrajets();
    fetchConducteurs();
    fetchVehicules();
    fetchVilles();
    //socket work
    socket.on("trajet:created", (newTrajet) => {
      setTrajets((prev) => [...prev, newTrajet]);
    });

    socket.on("trajet:updated", (updatedTrajet) => {
      setTrajets((prev) => prev.map((t) => (t._id === updatedTrajet._id ? updatedTrajet : t)));
    });

    socket.on("trajet:deleted", ({ id }) => {
      setTrajets((prev) => prev.filter((t) => t._id !== id));
    });

    socket.on("chauffeur:update", (data) => {
      if (data.type === "update") {
        setChauffeurs((prevChauffeurs) =>
          prevChauffeurs.map((chauffeur) =>
            chauffeur._id === data.chauffeur._id ? data.chauffeur : chauffeur
          )
        );
      }
    });

    return () => {
      socket.off("trajet:created");
      socket.off("trajet:updated");
      socket.off("trajet:deleted");
      socket.off("chauffeur:update");
    };

  }, [fetchTrajets, fetchConducteurs, fetchVehicules, fetchVilles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.origine.trim()) newErrors.origine = "L'origine du trajet est requise.";
    if (!formData.destination.trim()) newErrors.destination = "La destination est requise.";
    if (!formData.distance || formData.distance <= 0) {
      newErrors.distance = "La distance doit être un nombre positif.";
    }
    if (!formData.prix || formData.prix <= 0) {
      newErrors.prix = "Le prix doit être un nombre positif."; 
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (trajet) => {
    const chauffeur = chauffeurs.find((c) => c._id === trajet.chauffeur_id);
    const vehicule = vehicules.find((v) => v._id === trajet.vehicule_id);
  
    setFormData({
      origine: trajet.origine,
      destination: trajet.destination,
      distance: trajet.distance,
      prix: trajet.prix,
      type_transport: trajet.type_transport,
      horaire_depart: trajet.horaire_depart,
      horaire_arrivee: trajet.horaire_arrivee,
      chauffeur_id: trajet.chauffeur_id._id,
      vehicule_id: trajet.vehicule_id._id,
    });

    console.log("la data :", formData);
    console.log("Chauffeur trouvé :", vehicule);
    setSelectedTrajetId(trajet._id);
    setEditMode(true);
    setVisible(true);
  };
  
  

  const handleDeleteConfirmation = (trajetId) => {
    setTrajetToDelete(trajetId);
    setDeleteModalVisible(true);
  };

  const handleDeleteAction = async () => {
    if (trajetToDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/${trajetToDelete}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
  
        setTrajets((prevTrajets) => prevTrajets.filter((t) => t._id !== trajetToDelete));
        setDeleteModalVisible(false);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };
  

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      // Si en mode édition, mettre à jour les statuts des véhicules et chauffeurs
      if (editMode) {
        // Mettre à jour l'état du véhicule et du chauffeur précédemment affectés
        const previousTrajet = trajets.find(t => t._id === selectedTrajetId);
        const previousVehicule = previousTrajet.vehicule_id;
        const previousChauffeur = previousTrajet.chauffeur_id;
        console.log("Trajet précédent :", previousTrajet);
        console.log("Véhicule précédent :", previousVehicule);
        console.log("Chauffeur précédent :", previousChauffeur);
  
        // Modifier les statuts de l'ancien véhicule et chauffeur pour les rendre "Disponible"
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/vehicule/${previousVehicule._id}/update`, {
          statut: "Disponible",
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/${previousChauffeur._id}/update`, {
          statut: "Disponible",
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
  
        // Modifier les statuts du nouveau véhicule et chauffeur pour les rendre "Non disponible"
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/vehicule/${formData.vehicule_id}/update`, {
          statut: "Nom disponible",
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chauffeur/${formData.chauffeur_id}/update`, {
          statut: "En Service",
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
      }
  
      const url = editMode
        ? `${process.env.REACT_APP_BACKEND_URL}/api/trajet/${selectedTrajetId}`
        : process.env.REACT_APP_BACKEND_URL+"/api/trajet/create";
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
  
      const result = await response.json();
  
      setTrajets((prevTrajets) =>
        editMode
          ? prevTrajets.map((t) => (t._id === selectedTrajetId ? result.trajet : t))
          : [...prevTrajets, result.trajet]
      );
  
      setSuccessMessage(editMode ? "Trajet modifié avec succès !" : "Trajet ajouté avec succès !");
      fetchTrajets();
      setTimeout(() => {
        setSuccessMessage("");
        setVisible(false);
        setEditMode(false);
        setSelectedTrajetId(null);
        setFormData({ origine: "", destination: "", distance: 0, horaire_depart: "00:00", horaire_arrivee: "00:00", type_transport: "", prix: 0 });
        setErrors({});
      }, 2000);
    } catch (error) {
      setErrors({ api: error.message || "Erreur lors du traitement." });
    }
  };
  

  return (
    <Box p={3}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Gestion des Trajets
        </Typography>
        <CButton color="primary" onClick={() => setVisible(!visible)}>
          Nouveau trajet <AirlineStopsIcon />
        </CButton>
      </div>
      <Typography>Gérez vos trajets ici.</Typography>

      <CModal alignment="center" visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Typography>Êtes-vous sûr de vouloir supprimer ce trajet ?</Typography>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>Annuler</CButton>
          <CButton color="danger" onClick={handleDeleteAction}>Supprimer</CButton>
        </CModalFooter>
      </CModal>

      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle style={{ textAlign: "center" }}>
            {editMode ? "Modifier le trajet" : "Ajouter un trajet"} <AirlineStopsIcon />
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          {errors.api && <CAlert color="danger">{errors.api}</CAlert>}
          <CForm>
            <Grid container spacing={2}> {/* Grid Container */}
              <Grid item xs={6}> {/* Origine */}
                <label>Ville de départ</label>
                <CFormSelect name="origine" value={formData.origine} onChange={handleChange}>
                  <option value="">Sélectionnez une ville</option>
                  {villes.map((ville) => (
                    <option key={ville._id} value={ville.nom}>{ville.nom}</option>
                  ))}
                </CFormSelect>
              </Grid>

              <Grid item xs={6}> {/* Ville d'arrivée */}
                <label>Ville d'arrivée</label>
                <CFormSelect name="destination" value={formData.destination} onChange={handleChange}>
                  <option value="">Sélectionnez une ville</option>
                  {villes
                    .filter((ville) => ville.nom !== formData.origine)
                    .map((ville) => (
                      <option key={ville._id} value={ville.nom}>{ville.nom}</option>
                    ))}
                </CFormSelect>
              </Grid>

              <Grid item xs={6}> {/* Distance */}
                <label>Distance (en kilomètres)</label>
                <CFormInput 
                  type="number" 
                  name="distance" 
                  value={formData.distance} 
                  onChange={handleChange} 
                  placeholder="Saisir la distance en km" 
                  style={{ width: '100%' }}
                />
                {errors.distance && <CAlert color="danger">{errors.distance}</CAlert>}
              </Grid>

              <Grid item xs={6}> {/* Prix */}
                <label>Prix</label>
                <CFormInput 
                  type="number" 
                  name="prix" 
                  value={formData.prix} 
                  onChange={handleChange} 
                  placeholder="Saisir le prix (CFA)" 
                  style={{ width: '100%' }}
                />
                {errors.prix && <CAlert color="danger">{errors.prix}</CAlert>}
              </Grid>

              <Grid item xs={6}> {/* Horaire de départ */}
                <label>Horaire de départ</label>
                <CFormInput type="time" name="horaire_depart" value={formData.horaire_depart} onChange={handleChange} style={{ width: '100%' }} />
              </Grid>

              <Grid item xs={6}> {/* Horaire d'arrivée */}
                <label>Horaire d'arrivée</label>
                <CFormInput type="time" name="horaire_arrivee" value={formData.horaire_arrivee} onChange={handleChange} style={{ width: '100%' }} />
              </Grid>

              <Grid item xs={6}>
              <label>Chauffeur</label>
              <CFormSelect name="chauffeur_id" value={formData.chauffeur_id} onChange={handleChange}>
                <option value="">Sélectionnez un chauffeur</option>
                {chauffeurs.map((chauffeur) => (
                  <option key={chauffeur._id} value={chauffeur._id}>
                    {chauffeur.nom}
                  </option>
                ))}
              </CFormSelect>
            </Grid>
              {/* Type de transport */}
              <Grid item xs={6}>
                <label>Type de transport</label>
                <CFormSelect name="type_transport" value={formData.type_transport} onChange={handleChange}>
                  <option value="">Sélectionnez un type de transport</option>
                  <option value="bus">Bus</option>
                  <option value="minibus">Minibus</option>
                  <option value="taxi">Taxi</option>
                </CFormSelect>
                {errors.type_transport && <CAlert color="danger">{errors.type_transport}</CAlert>}
              </Grid>

              {/* Véhicules */}
              <Grid item xs={6}>
            <label>Véhicule</label>
            <CFormSelect name="vehicule_id" value={formData.vehicule_id} onChange={handleChange}>
              <option value="">Sélectionnez un véhicule</option>
              {vehicules.map((vehicule) => (
                <option key={vehicule._id} value={vehicule._id}>
                  {vehicule.marque} - {vehicule.immatriculation}
                </option>
              ))}
            </CFormSelect>
          </Grid>

            </Grid>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Annuler</CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editMode ? "Modifier" : "Ajouter"} le trajet
          </CButton>
        </CModalFooter>
      </CModal>
      <TrajetSmartTable onEdit={handleEdit} loading={loading} />
    </Box>
  );
}

export default Trajet;