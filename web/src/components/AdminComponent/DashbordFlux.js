import React, { useEffect, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilOptions, cilChartPie } from '@coreui/icons';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import io from 'socket.io-client'; 
import { CCard, CCardHeader, CListGroup, CListGroupItem } from '@coreui/react'
import { cilWc, cilWheelchair ,cilCalendar,cilGraph} from '@coreui/icons';
import InfoIcon from '@mui/icons-material/Info';
// URL de votre serveur WebSocket

import {
  CCol,
  CWidgetStatsC,

  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CWidgetStatsF,
  CRow,
  CWidgetStatsA,
} from '@coreui/react';

export const DashbordFlux = () => {
  
const socket = io(process.env.REACT_APP_BACKEND_URL+"", {
  transports: ["websocket", "polling"], // Ajoute cette option
 // Pour gérer les sessions/cookies si besoin
});

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentsByMonth, setPaymentsByMonth] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalTrajets, setTotalTrajets] = useState(0);
  const [totalConducteurs, setTotalConducteurs] = useState(0);
  const [conducteursEnService, setConducteursEnService] = useState(0);
  const [vehiculesNonDisponibles, setVehiculesNonDisponibles] = useState(0);
  const [totalVehicules, setTotalVehicules] = useState(0);
  const [vehicules, setVehicules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [conducteurs, setConducteurs] = useState([]);
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [plannings, setPlannings] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    date: '',
    tarif: '',
    horaire: '',
    seatNumber: '',
    paymentStatus: ''
  });
  
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/payment/payments", { 
        method: "GET", 
        timeout: 30000 
      });
  
      const data = await response.json();
      const total = data
        .filter(payment => payment.status === "succeeded")
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      
      const totalCount = data.length;
  
      setTotalAmount(total);
      setTotalCount(totalCount);
  
      const paymentsPerMonth = data.reduce((acc, payment) => {
        const month = new Date(payment.created).getMonth();
        acc[month] = acc[month] ? acc[month] + 1 : 1;
        return acc;
      }, []);
  
      setPaymentsByMonth(paymentsPerMonth);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements :", error);
    }
  };
  

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/users/clients-no-pagination", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setTotalClients(data.totalClients);
      console.log(totalClients);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };
  

  const fetchReservations = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/reservation/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setTotalReservations(data.reservations.length || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  };
  

  const fetchTrajets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/trajet/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setTotalTrajets(data.trajets.length || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des trajets :", error);
    }
  };
  

  const fetchConducteurs = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/chauffeur/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setTotalConducteurs(data.chauffeurs.length || 0);
      setConducteursEnService(data.chauffeurs.filter(chauffeur => chauffeur.statut === "En service").length || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des conducteurs :", error);
    }
  };
  
  
  const fetchVehicules = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/vehicule/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      const indisponibles = data.vehicules.filter(vehicule => vehicule.statut === "Non disponible").length;
  
      setVehiculesNonDisponibles(indisponibles);
      setTotalVehicules(data.vehicules.length || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    }
  };
  
useEffect(() => {
    fetchReservations();
    fetchPayments();
    fetchClients();
    fetchTrajets();
    fetchConducteurs();
    fetchVehicules();

    //compte rebourse
    let start = 0;
    const duration = 1000; // Durée totale de l'animation en millisecondes (2 secondes)
    const increment = totalAmount / (duration / 10); // Calcul de l'incrément
    const timer = setInterval(() => {
      start += increment;
      if (start >= totalAmount) {
        setDisplayedAmount(totalAmount.toFixed(2));
        clearInterval(timer);
      } else {
        setDisplayedAmount(start.toFixed(2));
      }
    }, 10); // Mise à jour toutes les 10ms
    
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

    if (localStorage.getItem("token")) {
      const handleSocketUpdate = (data) => {
        if (data.type === "create") {
          setReservations((prevReservations) => [data.reservation, ...prevReservations]);
        } else if (data.type === "update") {
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation._id === data.reservation._id ? data.reservation : reservation
            )
          );
        } else if (data.type === "delete") {
          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation._id !== data.id)
          );
        }
      };

      socket.on("reservation:update", handleSocketUpdate);

      return () => {
        socket.off("reservation:update", handleSocketUpdate); 
      };
    }

    socket.on("chauffeur:update", (data) => {
      if (data.type === "create") {
        setConducteurs((prev) => [...prev, data.chauffeur]);
      } else if (data.type === "update") {
        setConducteurs((prev) => prev.map((chauffeur) => 
          chauffeur._id === data.chauffeur._id ? data.chauffeur : chauffeur
        ));
      } else if (data.type === "delete") {
        setConducteurs((prev) => prev.filter((chauffeur) => chauffeur._id !== data.id));
      }
    });

    return () => {
      socket.off("vehicule:update");
      socket.off("chauffeur:update");
      clearInterval(timer);
    };
  }, [navigate,totalAmount]);

//trajet loading planning
useEffect(() => {
  let isMounted = true;
  socket.on("planning:update", (data) => {
    if (data.type === "create") {
      setPlannings(prevPlannings => [...prevPlannings, data.planning]);
    }
  });

  // Requête GET pour récupérer tous les trajets
  fetch(process.env.REACT_APP_BACKEND_URL + "/api/trajet/all-no-pagination")
    .then(response => response.json())
    .then(data => {
      if (isMounted) setTrajets(data.trajets);
    })
    .catch(error => console.error("Erreur lors de la récupération des trajets :", error));

  // Requête GET pour récupérer tous les plannings avec le token d'authentification
  fetch(process.env.REACT_APP_BACKEND_URL + "/api/planning/all", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => response.json())
    .then(data => {
      setPlannings(data.plannings);
    })
    .catch(error => console.error("Erreur lors de la récupération des plannings :", error));

  return () => {
    isMounted = false;
    socket.off("planning:update");
  };
}, []);


const handleTrajetClick = (trajet) => {
  navigate("/admin/reservation", { 
    state: { 
      departureCity: trajet.origine, 
      arrivalCity: trajet.destination, 
      date: new Date().toISOString().split("T")[0] // Date actuelle
    }
  });
};



  // Récupération du jour actuel en français
  const today = new Date();
  const options = { weekday: 'long' };
  const jourActuel = today.toLocaleDateString('fr-FR', options);
  const heureActuelle = today.getHours() * 60 + today.getMinutes();

  // Filtrage des trajets du jour actuel
  const planningJourActuel = plannings.filter(planning => planning.jour.toLowerCase() === jourActuel.toLowerCase());
  const trajetsJourActuel = planningJourActuel.flatMap(planning => planning.trajets)
    .filter(trajet => {
      const [heure, minute] = trajet.horaire_depart.split(':').map(Number);
      const heureDepartMinutes = heure * 60 + minute;
      return heureDepartMinutes > heureActuelle;
    });

  return (
    <CRow>
    {/* Paiements par mois */}
    <CCol sm={{ span: 6 }}>
      <CWidgetStatsA
        className="mb-4 w-100"
        style={{ backgroundColor: 'rgb(28, 83, 43)', color: 'white' }}
        value={
          <>
            {/* ${totalAmount.toFixed(2)}{' '} */}
            ${displayedAmount}{' '}
            <span className="fs-6 fw-normal">
              ({(totalAmount / totalCount).toFixed(2)} per payment)
            </span>
          </>
        }
        title="Montant total des paiements"
        action={
          <CDropdown alignment="end">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => navigate("/admin/paiement")}>Action</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        }
        chart={
          <CChartLine
            className="mt-3 mx-3"
            style={{ height: '70px' }}
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [
                {
                  label: 'Fréquence des paiements',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: '#39f',
                  data: [1, 18, 9, 17, 34, 22, 11],
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              maintainAspectRatio: false,
              scales: {
                x: { grid: { display: false }, ticks: { display: false } },
                y: { grid: { display: false }, ticks: { display: false } },
              },
            }}
          />
        }
      />
    </CCol>
    {/* Trajets disponibles */}
    <CCol sm={6}>
      <CCard style={{ width: '35rem' }}>
        <CCardHeader>Depart disponibles pour aujourd'hui ({jourActuel})</CCardHeader>
        <CListGroup flush style={{ fontSize: '0.875rem' }}> {/* Taille de la police réduite */}
          {trajetsJourActuel.length > 0 ? (
            trajetsJourActuel.map((trajet, idx) => (
              <CListGroupItem key={idx} 
              style={{ padding: '0.5rem 1rem', minHeight: '2rem' , cursor: 'pointer'}}
              onClick={() => handleTrajetClick(trajet)}
              > {/* Réduction de la hauteur */}
                <strong>{trajet.origine} → {trajet.destination}</strong> Départ: {trajet.horaire_depart} - Arrivée: {trajet.horaire_arrivee}
              </CListGroupItem>
            ))
          ) : (
            <CListGroupItem style={{ 
              padding: '0.5rem 1rem', 
              minHeight: '7rem' ,
              padding: '0.5rem 1rem', 
              minHeight: '7rem', 
              backgroundColor:'rgba(32, 23, 24, 0.16)',  // Couleur de fond (rouge clair par défaut)
              textAlign: 'center', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' }}>
              Aucun trajet prévu aujourd'hui &nbsp;<InfoIcon/>
            </CListGroupItem>
          )}
        </CListGroup>
      </CCard>
    </CCol>
     {/* Nombre de chauffeur client (Empilé) */}
     <CCol xs={6}>
      <CWidgetStatsF
        className="mb-1"
        style={{ height: '40%' }} 
        icon={<CIcon icon={cilWc} height={36} style={{ color: '#2d6c43a3' }} />}
        progress={{ color: 'success', value: (totalClients / 100) * 100 }}
        title="Total Clients"
        value={totalClients}
      />
      <CWidgetStatsF
        className="mb-0"
        style={{
          backgroundColor: 'rgba(210, 211, 221, 0.57)', // Ajoute ici la couleur de fond
          height: '40%' 
        }}
        icon={<CIcon icon={cilWheelchair} height={36} style={{ color: '#b95d1a' }} />}
        progress={{ color: 'success', value: totalConducteurs ? (conducteursEnService / totalConducteurs) * 100 : 0 }}
        title="Conducteurs en service / Total "
        value={`${conducteursEnService} / ${totalConducteurs}`}
      />
    </CCol>
    {/* Nombre de réservations (Empilé) */}
    <CCol xs={6}>
      <CWidgetStatsF
        style={{ height: '40%' }} // Ajuste la hauteur ici
        className="mb-1"
        color="primary"
        icon={<CIcon icon={cilCalendar} height={20} />} // Réduction de l'icône aussi
        title="Totale de réservations"
        value={totalReservations}
      />
      <CWidgetStatsF
        style={{ height: '40%' }} // Ajuste la hauteur ici
        className="mb-3"
        color="warning"
        icon={<CIcon icon={cilGraph} height={20} />} // Réduction de l'icône aussi
        title="Totale trajets disponibles (Système %)"
        value={totalTrajets}
      />
    </CCol>
    {/* Vehicules */}
    <CCol sm={6}>
      <div
        style={{
          // backgroundColor: 'rgba(210, 211, 221, 0.57)',  // Couleur de fond
          padding: '1rem',
          borderRadius: '8px',  // Bordure arrondie
          display: 'flex',
          flexDirection: 'column',
        
        
        }}
      >
        {/* Icône DirectionsBusFilledIcon */}
        <DirectionsBusFilledIcon
          style={{
            fontSize: '40px',  // Taille de l'icône
            color: '#b95d1a',  // Couleur de l'icône
            marginBottom: '1rem',  // Espacement sous l'icône
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />   
        <p style={{ fontSize: '18px', color: '#333' }}>
          {`${vehiculesNonDisponibles} / ${totalVehicules}`}
        </p>
        Véhicules en voyage / Total
      </div>
    </CCol>
  </CRow>
  )
}
