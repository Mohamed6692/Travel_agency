import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { Button, MenuItem, Select } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import MultiStepFromContext from "./MultiStepFromContext";
import { Typography } from "@mui/material";

const StepTwo = () => {
  const { address, details, setDetails, next, prev } = useContext(MultiStepFromContext);
  const [trajetData, setTrajetData] = useState([]);

  console.log("addres",address);

  // Chargement des trajets depuis l'API
  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/all-no-pagination`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Réponse reçue :", data);
  
        if (data.success) {
          const allTrajets = data.trajets;
  
          if (address.departureCity && address.arrivalCity) {
            const filteredTrajets = allTrajets.filter(
              trajet =>
                trajet.origine.toLowerCase() === address.departureCity.toLowerCase() &&
                trajet.destination.toLowerCase() === address.arrivalCity.toLowerCase()
            );
            setTrajetData(filteredTrajets);
          } else {
            setTrajetData(allTrajets);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des trajets :", error);
      }
    };
  
    fetchTrajets();
  }, [address.departureCity, address.arrivalCity]);
  

  return (
    <Formik
      initialValues={details}
      enableReinitialize
      onSubmit={(values) => {
        setDetails(values);
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.horaire) errors.horaire = "Veuillez sélectionner un horaire";
        return errors;
      }}
    >
      {({ handleSubmit, errors, values, setFieldValue }) => (
        <div className="details__wrapper">
          <Typography variant="body1" fontSize="0.9rem" fontWeight="bold">
            Tarif du trajet {address.departureCity} → {address.arrivalCity} :  
            <Typography component="span" color="primary" fontWeight="bold">
              {address.tarif} FCFA
            </Typography>
          </Typography>

          <div className={`form__item ${errors.horaire && "input__error"}`}>
            <FormControl>
              <FormLabel>Choisissez un horaire *</FormLabel>
              <RadioGroup
                row
                name="horaire"
                value={values.horaire}
                onChange={(e) => setFieldValue("horaire", e.target.value)}
              >
                {trajetData.length > 0 ? (
                  trajetData.map((trajet, index) => (
                    <FormControlLabel 
                      key={index} 
                      value={trajet.horaire_depart} 
                      control={<Radio />} 
                      label={`${trajet.horaire_depart} → ${trajet.horaire_arrivee}`} 
                    />
                  ))
                ) : (
                  <Typography variant="body1">Aucun horaire disponible</Typography>
                )}
              </RadioGroup>
            </FormControl>
            <p className="error__feedback">{errors.horaire}</p>
          </div>

          <div className="form__item d-flex justify-content-between">
            <Button onClick={prev}>Back</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default StepTwo;

