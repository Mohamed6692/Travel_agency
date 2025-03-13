import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable, CModal, CModalBody, CModalFooter, CModalHeader, CToast, CToastBody, CToastHeader } from "@coreui/react-pro";
import axios from "axios";
import Typography from '@mui/material/Typography'; // Import Typography
import io from "socket.io-client"; // Import socket.io-client
import { CPagination, CPaginationItem } from "@coreui/react";

const socket = io(process.env.REACT_APP_BACKEND_URL+""); // Set up socket connection with your backend

const getBadge = (status) => {
  switch (status) {
    case "Disponible":
      return "success";
    case "En maintenance":
      return "warning";
    case "Hors service":
      return "danger";
    default:
      return "secondary";
  }
};

export const VehiculeSmartTable = ({ onEdit, refreshTable }) => {
  const [details, setDetails] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;
  const [showModal, setShowModal] = useState(false);
  const [vehiculeToDelete, setVehiculeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Pour afficher le message de succès

  // Fetch vehicles with Bearer token
  const fetchVehicules = async (page = 1) => {
    setLoading(true);

    // Récupérer le token d'authentification depuis le localStorage
    const token = localStorage.getItem("token");

    try {
      // Effectuer la requête GET avec le token dans l'en-tête Authorization
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/vehicule/all?page=${page}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajout du token Bearer
        },
      });
      setVehicules(data.vehicules || []);
      setPages(data.pages || 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    }

    setLoading(false);
  };

  //pagination
 // Fonction de changement de page
 const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= pages) {
    setPage(newPage);
  }
};
  

  const deleteVehicule = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/vehicule/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
  
      // Afficher le message de succès
      setSuccessMessage(data.message);
  
      // Rafraîchir la liste des véhicules après suppression
      fetchVehicules();
  
      // Fermer le modal après suppression
      setShowModal(false);
  
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage("");  // Effacer le message après 3 secondes
      }, 3000);  // Délai de 3000 millisecondes (3 secondes)
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule :", error);
    }
  };
  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchVehicules(); // Charge les véhicules si un token est présent
    }

    socket.on("vehicule:update", (data) => {
      if (data.type === "create") {
        setVehicules((prev) => [...prev, data.vehicule]); 
      } else if (data.type === "update") {
        setVehicules((prev) => prev.map((vehicule) => 
          vehicule._id === data.vehicule._id ? data.vehicule : vehicule
        ));
      } else if (data.type === "delete") {
        setVehicules((prev) => prev.filter((vehicule) => vehicule._id !== data.id));
      }
    });

    return () => {
      socket.off("vehicule:update"); // Nettoyer l'écouteur lorsque le composant est démonté
    };
  }, [page, search]);


  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/vehicule/${id}`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVehicules((prev) =>
        prev.map((vehicule) => (vehicule._id === id ? { ...vehicule, statut: newStatus } : vehicule))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const columns = [
    { key: "immatriculation", label: "Immatriculation" },
    { key: "marque", label: "Marque" },
    { key: "modele", label: "Modèle" },
    { key: "capacite", label: "Capacité" },
    { key: "statut", label: "Statut" },
    { key: "show_details", label: "", filter: false, sorter: false },
  ];

  const toggleDetails = (id) => {
    setDetails((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <CSmartTable
        columns={columns}
        items={vehicules}
        loading={loading}
        pagination
        columnFilter
        columnSorter
        cleaner
        clickableRows
        itemsPerPage={5}
        onFilteredItemsChange={(items) => {
          console.log('onFilteredItemsChange');
         
        }}
        onSelectedItemsChange={(items) => {
          console.log('onSelectedItemsChange');
         
        }}
        scopedColumns={{
          date_ajout: (item) => (
            <td>{new Date(item.date_ajout).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</td>
          ),
          statut: (item) => (
            <td>
              <CBadge color={getBadge(item.statut)}>{item.statut}</CBadge>
            </td>
          ),
          chauffeur_id: (item) => (
            <td>{item.chauffeur_id ? `${item.chauffeur_id.firstName} ${item.chauffeur_id.lastName}` : "Non assigné"}</td>
          ),
          show_details: (item) => (
            <td className="py-2">
              <CButton
                color="primary"
                variant="outline"
                size="sm"
                onClick={() => toggleDetails(item._id)}
              >
                {details.includes(item._id) ? "Cacher" : "Voir"}
              </CButton>
            </td>
          ),
          details: (item) => (
            <CCollapse visible={details.includes(item._id)}>
              <div className="p-2">
                <h5 style={{ fontSize: "0.975rem" }}>{item.marque}</h5>
                <p className="text-body-secondary" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Immatriculation : <strong>{item.immatriculation}</strong><br />
                  Capacité : <strong>{item.capacite}</strong> places<br />
                  Date ajout :  <strong>{new Date(item.date_ajout).toLocaleDateString()}</strong>
                 
                </p>
                <CButton size="sm" color="info" style={{ fontSize: "0.75rem" }} onClick={() => onEdit(item)}>
                  Modifier
                </CButton>
                <CButton
                  size="sm"
                  color="danger"
                  className="ms-1"
                  style={{ fontSize: "0.75rem" }}
                  onClick={() => {
                    setVehiculeToDelete(item._id);
                    setShowModal(true);
                  }}
                >
                  Supprimer
                </CButton>
              </div>
            </CCollapse>
          ),
        }}
        noItemsLabel="Aucun véhicule disponible"
        selectable
        tableFilter
        tableProps={{
          className: 'add-this-custom-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />

      {/* Modal de confirmation */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"
      >
        <CModalHeader>Confirmation de suppression</CModalHeader>
        <CModalBody>
          <Typography>Êtes-vous sûr de vouloir supprimer ce véhicule ?</Typography>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={() => deleteVehicule(vehiculeToDelete)}>
            Supprimer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Affichage du message de succès */}
      {successMessage && (
        <CToast color="success" className="text-white">
          <CToastHeader closeButton>Succès</CToastHeader>
          <CToastBody>{successMessage}</CToastBody>
        </CToast>
      )}

      {/* Pagination personnalisée avec CoreUI */}
       <div className="d-flex justify-content-center my-3">
                <CPagination aria-label="Page navigation example">
                  <CPaginationItem
                    aria-label="Previous"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
      
                  {[...Array(pages)].map((_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={page === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
      
                  <CPaginationItem
                    aria-label="Next"
                    disabled={page === pages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
        </div>
    </>
  );
};

