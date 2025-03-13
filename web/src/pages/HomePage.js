import React, { useRef } from "react";
import { useAlert } from "../contexts/AlertContext";
import { Alert, Stack } from "@mui/material";
import TicketProcess from "../components/TicketProcess";
import StatistiqueAction from "../components/StatistiqueAction";
import Accueil from "../components/Accueil";
import Destination from "components/Destination";
import Footer from "components/Footer";

export default function HomePage() {
  const { alert } = useAlert();
  const ticketProcessRef = useRef(null);

  // Fonction pour défiler vers la section TicketProcess avec un niveau ajusté
  const scrollToTicketProcess = () => {
    if (ticketProcessRef.current) {
      // Calcul de la position avec un offset de 100px (ajuster selon les besoins)
      const offset = ticketProcessRef.current.getBoundingClientRect().top + window.scrollY - 100; // Ajuste le -100 selon le niveau désiré
      window.scrollTo({
        top: offset,
        behavior: "smooth", // Défilement fluide
      });
    }
  };

  return (
    <>
      <section className="container">
        {alert.open && (
          <Stack
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            spacing={2}
          >
            <Alert severity={alert.severity}>{alert.message}</Alert>
          </Stack>
        )}
      </section>

      <Accueil onReserveClick={scrollToTicketProcess} />
      <div ref={ticketProcessRef}>
        <TicketProcess sx={{ marginBottom: "12rem" }}/>
      </div>
      <StatistiqueAction />
      <Destination />
      <Footer />
    </>
  );
}
