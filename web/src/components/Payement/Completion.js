import { useEffect, useState } from "react";
import TicketGenerator from "../MultiStepForm/TicketGenerator";

function Completion() {
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("reservationDatas");
    if (storedData) {
      setReservation(JSON.parse(storedData));
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ fontSize: "1.8rem" }}>Merci pour votre réservation ! 🎉</h1>
      
      {reservation ? (
        <>
          {/* 🔥 Passer les données au TicketGenerator */}
          <TicketGenerator reservationData={reservation} />
        </>
      ) : (
        <p>Chargement des informations...</p>
      )}
    </div>
  );
}

export default Completion;
