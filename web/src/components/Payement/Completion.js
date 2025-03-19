import { useEffect, useState } from "react";
import TicketGenerator from "../MultiStepForm/TicketGenerator";

function Completion() {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("reservationData"); // ✅ Correction ici
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setReservation(parsedData);
      } catch (error) {
        console.error("Erreur de parsing des données de réservation :", error);
      }
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ fontSize: "1.8rem" }}>Merci pour votre réservation ! 🎉</h1>

      {reservation && Object.keys(reservation).length > 0 ? (
        <TicketGenerator reservationData={reservation} />
      ) : (
        <p>Aucune information de réservation trouvée.</p>
      )}
    </div>
  );
}

export default Completion;
