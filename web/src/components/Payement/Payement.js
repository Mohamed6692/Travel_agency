import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import "./index.css";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch(process.env.REACT_APP_BACKEND_URL+"/api/payment/config", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Ajout du Bearer token
        },
      })
        .then(async (r) => {
          if (!r.ok) {
            throw new Error("Unauthorized");
          }
          const { publishableKey } = await r.json();
          setStripePromise(loadStripe(publishableKey));
        })
        .catch((error) => {
          console.error("Error fetching config:", error);
          // Traite l'erreur (afficher un message d'erreur ou rediriger l'utilisateur)
        });
    }
  }, [token]);

  useEffect(() => {
    const reservationData = JSON.parse(localStorage.getItem("reservationData"));
    const tarif = reservationData?.address?.tarif || 5000; // Valeur par défaut si absent

    if (token) {
      fetch(process.env.REACT_APP_BACKEND_URL+"/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Ajout du Bearer token
        },
        body: JSON.stringify({ amount: tarif * 100 }), // Convertir en centimes
      })
        .then(async (result) => {
          if (!result.ok) {
            throw new Error("Unauthorized");
          }
          const { clientSecret } = await result.json();
          setClientSecret(clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          // Traite l'erreur (afficher un message d'erreur ou rediriger l'utilisateur)
        });
    }
  }, [token]);

  return (
    <>
      <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>
        Stripe Payment Gateway
      </h1>

      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
