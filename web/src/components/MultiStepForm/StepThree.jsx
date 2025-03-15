import React, { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import MultiStepFromContext from "./MultiStepFromContext";
import axios from "axios";

const StepThree = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFromContext);
  const [selectedSeat, setSelectedSeat] = useState(null);

    console.log("voir element",address)
    // Génération des numéros de sièges en fonction de address.seat
    const availableSeats = Array.from({ length: address.seat }, (_, i) => i + 1);

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
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: "200px", // Limite la hauteur du menu déroulant
                    overflowY: "auto", // Permet le défilement si nécessaire
                  },
                },
              }}
            >
              <MenuItem value="" disabled>Choisissez un siège</MenuItem>
              {availableSeats.map((seatNumber) => (
                <MenuItem key={seatNumber} value={seatNumber} sx={{ fontSize: "14px", minHeight: "3px" }}>
                  Siège {seatNumber}
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
