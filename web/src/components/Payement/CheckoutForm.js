import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import  MultiStepFromContext from "../MultiStepForm/MultiStepFromContext";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { details, address, prev } = useContext(MultiStepFromContext);
  const reservationData = JSON.parse(localStorage.getItem("reservationData"));
  const reservationId = localStorage.getItem("reservationId");
  // const { details, address } = reservationData || {};

  console.log("Données de réservation data :", reservationData);

  // console.log("Valeur de details :", address);
  // console.log("Valeur de address :", details);

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  console.log("Token récupéré :", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
  
    setIsProcessing(true);
  
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {}, // Pas de return_url
       redirect: "if_required", // Empêche la redirection immédiate
    });
    console.log("Données de réservation  id:", reservationId);
    if (error) {
      console.error("Erreur de paiement iciiii :", error);
      setMessage(error.message || "Une erreur inattendue est survenue.");
      console.log("Erreur de paiement :", error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Statut du paiement :", paymentIntent.status);
  
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
         
          // Redirection vers la page de confirmation
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
    <form id="payment-form" onSubmit={handleSubmit} style={{ width: "40%", margin: "auto" }}>
      <PaymentElement id="payment-element" style={{ marginBottom: "10px" }} />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit"
        style={{ width: "100%", padding: "8px", fontSize: "14px" }}
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
      {message && <div id="payment-message" style={{ marginTop: "10px", fontSize: "12px", color: "red" }}>{message}</div>}
    </form>
  );
}
