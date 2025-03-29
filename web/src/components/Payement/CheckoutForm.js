import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import MultiStepFromContext from "../MultiStepForm/MultiStepFromContext";
import { useTheme, useMediaQuery } from "@mui/material"; // Importation de MUI pour les media queries

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { details, address, prev } = useContext(MultiStepFromContext);
  const reservationData = JSON.parse(localStorage.getItem("reservationData"));
  const reservationId = localStorage.getItem("reservationId");

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const theme = useTheme(); 
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Détection des écrans mobiles

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {}, // Pas de return_url
      redirect: "if_required", // Empêche la redirection immédiate
    });

    if (error) {
      console.error("Erreur de paiement :", error);
      setMessage(error.message || "Une erreur inattendue est survenue.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
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
          setMessage("Paiement confirmé ! Réservation mise à jour.");
          localStorage.setItem("reservationData", JSON.stringify({ ...reservationData, paymentStatus: "succeeded" }));
          window.location.href = `${window.location.origin}/completion`;
        } else {
          throw new Error(data.message || "Une erreur est survenue lors de l'enregistrement.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Une erreur est survenue.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      style={{
        width: isSmallScreen ? "90%" : "40%", // Ajuste la largeur selon la taille de l'écran
        margin: "auto",
        padding: "20px",
      }}
    >
      <PaymentElement id="payment-element" style={{ marginBottom: "10px" }} />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: isSmallScreen ? "16px" : "14px", // Augmente la taille du texte sur les petits écrans
        }}
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
      {message && (
        <div
          id="payment-message"
          style={{
            marginTop: "10px",
            fontSize: isSmallScreen ? "14px" : "12px", // Ajuste la taille du message sur mobile
            color: "red",
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
}
