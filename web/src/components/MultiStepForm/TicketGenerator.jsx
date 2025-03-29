import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";
import { useTheme, useMediaQuery } from "@mui/material"; // Ajout de MUI pour les media queries

const TicketGenerator = ({ reservationData }) => {
  const ticketRef = useRef(null);
  const barcodeRef = useRef(null);
  const [reservationDate, setReservationDate] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Vérifie si l'écran est petit

  useEffect(() => {
    if (reservationData) {
      setReservationDate(new Date().toLocaleDateString("fr-FR"));

      if (barcodeRef.current && reservationData.seatNumber) {
        JsBarcode(barcodeRef.current, reservationData.seatNumber, {
          format: "CODE128",
          displayValue: true,
          fontSize: 14,
          width: 3,
          height: 50,
          margin: 10,
        });
      }
    }
  }, [reservationData]);

  if (!reservationData) return <p>Aucune réservation trouvée.</p>;

  const formattedDate = new Date(reservationData.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const downloadPDF = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
        pdf.save("ticket_reservation.pdf");
      });
    }
  };

  return (
    <div className="details__wrapper" style={{ padding: isSmallScreen ? "10px" : "20px" }}>
      <style jsx>{`
        .ticket-container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          margin: 20px auto;
          text-align: center;
          width: ${isSmallScreen ? "90%" : "30%"};
        }
        .custom-heading {
          font-size: ${isSmallScreen ? "1.2rem" : "1.5rem"};
          text-decoration: underline;
          margin-bottom: 15px;
        }
        .ticket-details {
          text-align: left;
          margin-left: 10px;
          font-size: ${isSmallScreen ? "0.8rem" : "0.9rem"};
        }
        .barcode-container {
          margin-top: 20px;
          text-align: center;
        }
      `}</style>

      <div ref={ticketRef} className="ticket-container">
        <h1 className="custom-heading">Ticket de Réservation 🎫</h1>
        <div className="ticket-details">
          <p><strong>Trajet :</strong> {reservationData.departureCity} → {reservationData.arrivalCity}</p>
          <p><strong>Horaire :</strong> {reservationData.horaire}</p>
          <p><strong>Numéro de siège :</strong> {reservationData.seatNumber}</p>
          <p><strong>Date de départ :</strong> {formattedDate}</p>
          <p><strong>Date de réservation :</strong> {reservationDate}</p>
        </div>

        <div className="barcode-container">
          <svg ref={barcodeRef}></svg>
        </div>
      </div>

      <Button type="primary" onClick={downloadPDF}>Télécharger le Ticket (PDF)</Button>
    </div>
  );
};

export default TicketGenerator;
