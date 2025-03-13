import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";

const TicketGenerator = ({ reservationData }) => {
  const ticketRef = useRef(null);
  const barcodeRef = useRef(null);
  const [reservationDate, setReservationDate] = useState(null);

  useEffect(() => {
    if (reservationData) {
      setReservationDate(new Date().toLocaleDateString("fr-FR"));

      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, reservationData.details.seatNumber, {
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

  const { address, details } = reservationData;

  const formattedDate = new Date(address.date).toLocaleDateString("fr-FR", {
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
    <div className="details__wrapper">
      <style jsx>{`
        .ticket-container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          margin: 20px auto;
          text-align: center;
          width: 20%;
        }
        .custom-heading {
          font-size: 1.5rem;
          text-decoration: underline;
          margin-bottom: 15px;
        }
        .ticket-details {
          text-align: left;
          margin-left: 10px;
          font-size: 0.9rem;
        }
        .barcode-container {
          margin-top: 20px;
          text-align: center;
        }
      `}</style>

      <div ref={ticketRef} className="ticket-container">
        <h1 className="custom-heading">Ticket de Réservation 🎫</h1>
        <div className="ticket-details">
          <p><strong>Trajet :</strong> {address.departureCity} → {address.arrivalCity}</p>
          <p><strong>Horaire :</strong> {details.horaire}</p>
          <p><strong>Numéro de siège :</strong> {details.seatNumber}</p>
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
