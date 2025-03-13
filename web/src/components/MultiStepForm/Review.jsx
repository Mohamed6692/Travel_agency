import * as React from 'react';
import { Button, Col, Row } from "antd";
import { useContext, useState } from "react";
import MultiStepFromContext from "./MultiStepFromContext";
import TicketGenerator from "./TicketGenerator";
import { useNavigate } from "react-router-dom";
import { Alert, Stack } from '@mui/material'; // Importer les composants MUI
import MethodePaiement from "../MethodePaiement";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const Review = ({ successMessage, setSuccessMessage }) => {
  const { details, address, prev } = useContext(MultiStepFromContext);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const reservationData = {
      departureCity: address.departureCity,
      arrivalCity: address.arrivalCity,
      date: address.date,
      tarif: address.tarif,
      horaire: details.horaire,
      seatNumber: details.seatNumber,
      user: localStorage.getItem("userId"),
      paymentStatus: "incomplete", // Création avec le statut "incomplete"
    };

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/reservation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Réservation créée avec succès :", data);
        localStorage.setItem("reservationData", JSON.stringify({ ...reservationData, id: data.id }));
        localStorage.setItem("reservationId", data.reservation._id);
        setShowPaymentMethods(true);
      } else {
        throw new Error(data.message || "Une erreur est survenue lors de la création de la réservation.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
    }

    localStorage.setItem("reservationDatas", JSON.stringify({ token, details, address }));
    setLoading(false);
    setShowPaymentMethods(true);
  };

  const formattedDate = new Date(address.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (showTicket) {
    return <TicketGenerator />;
  }

  if (showPaymentMethods) {
    return <MethodePaiement onSelectMethod={(index) => {
      if (index === 3) { // Stripe correspond à l'index 3
        navigate("/Stripe");
      }
    }} />;
  }

  return (
    <div className={"details__wrapper"}>
      <style jsx>{`
        .custom-heading {
          font-size: 1.2rem;
          text-decoration: underline;
          margin-bottom: 0.5rem; /* Réduit l'espace sous le titre */
        }

        .custom-text {
          margin-bottom: 0.25rem; /* Réduit l'espace entre chaque ligne de texte */
          line-height: 1.2; /* Réduit l'interligne */
        }

        .button__items {
          gap: 0.5rem; /* Réduit l'espace horizontal entre les boutons */
        }

        .button__items button {
          margin-bottom: 0; /* Assure qu'il n'y a pas de marge sous les boutons */
        }
      `}</style>

      <Row>
        <Col span={24}>
          <h1 className="custom-heading">Résumé de votre trajet </h1>
          <p className="custom-text"><strong>Trajet :</strong> De {address.departureCity} → {address.arrivalCity} <strong> </strong> {" "}<AccessTimeIcon style={{ fontSize: 16 }}/>  :{details.horaire}</p> 
          <p className="custom-text"><strong>Tarif :</strong> {address.tarif} FCFA</p>
          <p className="custom-text"><strong>Numéro de siège :</strong> {details.seatNumber}</p>
          <p className="custom-text"><strong>Date de départ :</strong> Pour le {formattedDate}</p>
        </Col>
        

        <Col span={24}>
          <div className="form__item button__items d-flex justify-content-between">
            <Button type="default" onClick={prev}>
              Retour
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Confirmer et Payer
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Review;
