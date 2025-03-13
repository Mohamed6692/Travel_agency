import React, { useEffect, useState } from "react";
import { CAvatar, CBadge, CButton, CCollapse, CSmartTable, CModal, CModalBody, CModalFooter, CModalHeader, CToast, CToastBody, CToastHeader } from "@coreui/react-pro";
import axios from "axios";
import Typography from '@mui/material/Typography'; // Import Typography
import { CPagination, CPaginationItem } from "@coreui/react";
import AccessibleIcon from '@mui/icons-material/Accessible';
import io from "socket.io-client"; // Import socket.io-client
const socket = io(process.env.REACT_APP_BACKEND_URL+""); // Set up socket connection with your backend


const getBadge = (status) => {
  switch (status) {
    case "Disponible":
      return "success";
    case "Complet":
      return "warning";
    case "Annulé":
      return "danger";
    default:
      return "secondary";
  }
};

export const TrajetSmartTable = ({onEdit, refreshTable }) => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 5;
  const [trajetToDelete, setTarjetToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Pour afficher le message de succès
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState([]);
  // Fetch trips from backend
  const fetchTrajets = async (age = 1) => {
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/all?page=${page}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTrajets(data.trajets || []);
      console.log("Trajets récupérés", data.trajets);
      setPages(data.pages || 1);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }

    setLoading(false);
  };


//pagination
 const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= pages) {
    setPage(newPage);
  }
};

  const deleteTrajet = async (id) => {
    try {
      const token = localStorage.getItem("token");
  
      const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Trajet supprimé", data);
  
      // Afficher le message de succès
      setSuccessMessage(data.message);
      // Fermer le modal après suppression
      setShowModal(false);
  
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage("");  // Effacer le message après 3 secondes
      }, 3000);  // Délai de 3000 millisecondes (3 secondes)
    } catch (error) {
      console.error("Erreur lors de la suppression du trajet :", error);
    }
  };
  
  useEffect(() => {
    // Vérification du token et appel de fetchTrajets
    if (localStorage.getItem("token")) {
      fetchTrajets(page);
    }
  
    // Gestion des événements Socket
    socket.on("trajet:created", (data) => {
      if (data && data.trajet) {
        setTrajets((prev) => [...prev, data.trajet]);
        console.log("Données de trajet  dans le socket", data);
      } else {
        console.error("Données de trajet créées invalides", data);
      }
    });
  
    socket.on("trajet:updated", (data) => {
      if (data && data.trajet) {
        setTrajets((prev) =>
          prev.map((trajet) => 
            trajet._id === data.trajet._id ? { ...trajet, ...data.trajet } : trajet
          )
        );
      } else {
        console.error("Données de trajet mises à jour invalides", data);
      }
    });
  
    socket.on("trajet:deleted", (data) => {
      if (data && data.id) {
        setTrajets((prev) => prev.filter((trajet) => trajet._id !== data.id));
      } else {
        console.error("Données de trajet supprimées invalides", data);
      }
    });

      // Écouter l'événement des trajets récupérés en temps réel
  socket.on("trajets:all", (data) => {
    if (data && data.trajets) {
      setTrajets(data.trajets);
      console.log("Tous les trajets reçus en temps réel", data.trajets);
    } else {
      console.error("Données de trajets invalides", data);
    }
  });
  
    // Nettoyage des événements Socket
    return () => {
      socket.off("trajet:created");
      socket.off("trajet:updated");
      socket.off("trajet:deleted");
      socket.off("trajets:all");
    };
  }, [page]);
  
  

  const columns = [
    { key: "origine", label: "Origine" },
    { key: "destination", label: "Destination" },
    { key: "prix", label: "Prix (XOF)" },
    { key: "horaire_depart", label: "Horaire Départ" },
    { key: "horaire_arrivee", label: "Horaire Arrivée" },
    { key: "etat", label: "État" },
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
      items={trajets}
      loading={loading}
      pagination
      columnFilter
      columnSorter
      cleaner
      clickableRows
      itemsPerPage={5}
      onFilteredItemsChange={(items) => {
        console.log('onFilteredItemsChange');
        console.table(items);
      }}
      onSelectedItemsChange={(items) => {
        console.log('onSelectedItemsChange');
        console.table(items);
      }}
      scopedColumns={{
        date_creation: (item) => (
          <td>{new Date(item.date_creation).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</td>
        ),
        etat: (item) => (
          <td>
            <CBadge color={getBadge(item.etat)}>{item.etat}</CBadge>
          </td>
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
                <h5 style={{ fontSize: "0.875rem" }}>Conducteur: {item.chauffeur_id?.nom} {item.chauffeur_id?.prenom}<br /> </h5>
                <p className="text-body-secondary" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Type transport: <strong>{item.type_transport}</strong><br />
                  Distance: <strong>{item.distance}</strong> km<br />
                  Date ajout:  <strong>{new Date(item.date_creation).toLocaleDateString()}</strong><br />
                  Véhicule: <strong>{item.vehicule_id?.marque}</strong><br /> {/* Display vehicle brand */}
                  Matricule: <strong>{item.vehicule_id?.immatriculation}</strong><br /> {/* Display vehicle matricule */} 
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
                    setTarjetToDelete(item._id);
                    setShowModal(true);
                  }}
                >
                  Supprimer
                </CButton>
              </div>
            </CCollapse>
          ),
        }}
      noItemsLabel="Aucune donnée disponible"
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
          <Typography>Êtes-vous sûr de vouloir supprimer ce trajet ?</Typography>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </CButton>
          <CButton color="danger" onClick={() => deleteTrajet(trajetToDelete)}>
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
