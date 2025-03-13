import React, { useState } from 'react';
import { CCard, CButton, CCardBody, CCardText, CCardTitle, CBadge, CAlert } from '@coreui/react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useNavigate } from "react-router-dom";
import CIcon from '@coreui/icons-react';
import { cilCheckCircle } from '@coreui/icons';

function EspeceForm() {
  const navigate = useNavigate();
  const reservationId = localStorage.getItem("reservationId");
  const reservationData = JSON.parse(localStorage.getItem("reservationData"));
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState(null);

  console.log("Données de réservation récupérées :", reservationData);

  const handlePaymentUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reservation/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: "succeeded" }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Message du backend
        localStorage.setItem("reservationData", JSON.stringify({ ...reservationData, paymentStatus: "succeeded" }));
        
        setTimeout(() => {
          navigate("/admin/reservation");
        }, 2000);
      } else {
        throw new Error(data.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ marginTop: '20px' }}>
      {message && (
        <CAlert color="success" className="d-flex align-items-center mb-3">
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{message}</div>
        </CAlert>
      )}

      <CCard style={{ width: '24rem' }}>
        <CCardBody className="text-center">
          <CCardTitle className='mb-2'>
            <strong>Methode Espece</strong> <PaymentsIcon/>
          </CCardTitle>
          <hr style={{ margin: "10px 0" }} /> {/* Ligne pour souligner */}
          <CCardText className="text-center">
            Avez-vous reçu l'espèce d'un montant de 
            <h6><CBadge color="secondary">{reservationData?.tarif} Fr CFA?</CBadge></h6>
          </CCardText>
          <div className="d-flex gap-3 justify-content-center mt-3"> {/* Ajout d'un gap entre les boutons */}
            <CButton color="danger">No <HighlightOffIcon/></CButton>
            <CButton color="primary" onClick={handlePaymentUpdate}>Espece recue <CheckCircleOutlineIcon/></CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default EspeceForm;
