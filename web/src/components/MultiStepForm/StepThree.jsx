import React, { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import MultiStepFromContext from "./MultiStepFromContext";
import axios from "axios";

const StepThree = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFromContext);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    if (address.departureCity && address.arrivalCity && address.date) {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/reservation/seatReservation?departureCity=${address.departureCity}&arrivalCity=${address.arrivalCity}&date=${address.date}`
        )
        .then((response) => {
          // Ajout d'un log pour inspecter la structure de la réponse
          console.log("Réponse API:", response.data);
          if (response.data.success) {
            const reservedSeats = response.data.reservations.map(
              (seat) => seat.toString()
            );
            const trajet = response.data.trajet;
            console.log("trajet", trajet);

            // Vérification si 'trajet' et 'vehicule_id' existent avant d'y accéder
            const capacite = trajet?.vehicule_id?.capacite || 0;
            if (capacite === 0) {
              console.log("Capacité non définie ou non trouvée");
            }

            // Création de allSeats en fonction de la capacité
            const allSeats = capacite > 0 ? Array.from({ length: capacite }, (_, i) => i + 1) : [];
            console.log("allSeats", allSeats);

            // Filtrer les sièges réservés
            const availableSeats = allSeats.filter(
              (seat) => !reservedSeats.includes(seat.toString())
            );

            setAvailableSeats(availableSeats);
          }
        })
        .catch((error) => console.error("Erreur lors de la récupération des sièges :", error));
    }
  }, [address]);

  return (
    <Formik
      initialValues={{ ...address, seat: "", confirmation: false }}
      enableReinitialize
      onSubmit={(values) => {
        setAddress(values);
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.seat || values.seat === "-") {
          errors.seat = "Veuillez sélectionner un numéro de siège";
        }
        return errors;
      }}
    >
      {({ handleSubmit, errors, values, setFieldValue }) => (
        <div className="details__wrapper">
          {/* Sélection du numéro de siège */}
          <div className={`form__item ${errors.seat && "input__error"}`} style={{ flex: 1 }}>
            <label>Numéro de siège *</label>
            <Select
              name="seat"
              value={values.seat}
              onChange={(e) => setFieldValue("seat", e.target.value)}
              style={{ width: "150px", height: "35px" }}
            >
              {availableSeats.map((seat) => (
                <MenuItem key={seat} value={seat}>
                  Siège {seat}
                </MenuItem>
              ))}
            </Select>
            <p className="error__feedback">{errors.seat}</p>
          </div>

          {/* Boutons Précédent et Suivant */}
          <div className="form__item button__items d-flex justify-content-between">
            <Button type="button" onClick={prev}>
              Back
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default StepThree;
