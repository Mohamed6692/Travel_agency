import React, { useContext,useState,useEffect } from "react";
import { useNavigate,useLocation } from 'react-router-dom'; // Import pour la redirection
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import MultiStepFromContext from "./MultiStepFromContext";
import { add, set } from "date-fns";
import { Typography } from "@mui/material";

import axios from 'axios';



const StepOne = () => {
  const { address, setAddress,setSeatNumbers, next } = useContext(MultiStepFromContext);
  const [trajets, setTrajets] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedTarif, setSelectedTarif] = useState(null);
  const [selectedHoraires, setSelectedHoraires] = useState([]);
  const [vehiculeCapacite, setVehiculeCapacite] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trajet/all-no-pagination`)
      .then((response) => response.json()) // Convertir la réponse en JSON
      .then((data) => {
        if (data.success) {
          setTrajets(data.trajets);
          setDepartureCities([...new Set(data.trajets.map((t) => t.origine))]);
        }
      })
      .catch((error) => console.error("Erreur lors du chargement des trajets:", error));
      // Mettre à jour si l'utilisateur redimensionne l'écran
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

     window.addEventListener("resize", handleResize);
     return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  
    //depart
    const handleDepartureChange = (e, setFieldValue) => {
      const departure = e.target.value;
      setSelectedDeparture(departure);
      setFieldValue("departureCity", departure);

      const filteredArrivalCities = [...new Set(
        trajets.filter((t) => t.origine === departure).map((t) => t.destination)
      )];

      setArrivalCities(filteredArrivalCities);
      setFieldValue("arrivalCity", ""); // Réinitialisation
    };

  //arrival
  const handleArrivalChange = (e, setFieldValue, values) => {
    const arrival = e.target.value;
    setFieldValue("arrivalCity", arrival);

    const trajet = trajets.find(
      (t) => t.origine === values.departureCity && t.destination === arrival
    );

    if (trajet) {
      console.log(trajet);
      setSelectedTarif(trajet.prix);
      setSelectedHoraires([trajet.horaire_depart, trajet.horaire_arrivee]);
      setFieldValue("tarif", trajet.prix);
      setFieldValue("horaires", [trajet.horaire_depart, trajet.horaire_arrivee]);
       // Met à jour la capacité du véhicule
      setVehiculeCapacite(trajet?.vehicule_id?.capacite || []);
      setFieldValue("seat", trajet?.vehicule_id?.capacite || []);
    }
  };




  return (
    <Formik
    initialValues={{ ...address, tarif: "", horaires: [], seat: [] }}
    onSubmit={(values) => {
      setAddress(values);
      next();
    }}
    validate={(values) => {
      const errors = {};
      if (!values.departureCity) errors.departureCity = "Départ requise";
      if (!values.arrivalCity) errors.arrivalCity = "Arrivée requise";
      if (!values.date) {
        errors.date = "Date requise";
      } else {
        const today = new Date();
        const selectedDate = new Date(values.date);
        if (selectedDate < today) {
          errors.date = "La date ne peut pas être inférieure à aujourd'hui";
        }
      }
      return errors;
    }}
  >
    {({ handleSubmit, errors, values, handleChange, setFieldValue }) => (
      <div className="details__wrapper">
        <div className="form__row" style={{ display: "flex", gap: "0.5rem" }}>
          {/* Sélection de la ville de départ */}
          <div className={`form__item ${errors.departureCity ? "input__error" : ""}`} style={{ flex: 1 }}>
            <label>Ville de départ *</label>
            <Select
              name="departureCity"
              value={values.departureCity}
              onChange={(e) => handleDepartureChange(e, setFieldValue)}
              fullWidth
              style={{ height: "35px" }}
            >
              {departureCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
            {errors.departureCity && <p className="error__feedback">{errors.departureCity}</p>}
          </div>
  
          {/* Sélection de la ville d'arrivée */}
          <div className={`form__item ${errors.arrivalCity ? "input__error" : ""}`} style={{ flex: 1 }}>
            <label>Ville d'arrivée *</label>
            <Select
              name="arrivalCity"
              value={values.arrivalCity}
              onChange={(e) => handleArrivalChange(e, setFieldValue, values)} // Ajout de la fonction
              fullWidth
              disabled={!selectedDeparture}
              style={{ height: "35px" }}
            >
              {arrivalCities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
            {errors.arrivalCity && <p className="error__feedback">{errors.arrivalCity}</p>}
          </div>
          
          {/* Sélection de la date */}
          <div className={`form__item ${errors.date ? "input__error" : ""}`} style={{ flex: 1 }}>
            <label>Date du voyage *</label>
            <div className="date-input-wrapper" style={{ position: "relative" }}>
              <DatePicker
                selected={values.date ? new Date(values.date) : null}
                onChange={(date) => setFieldValue("date", date ? date.toISOString() : "")}
                className="form-control"
                placeholderText="Date/"
                popperPlacement="bottom-end" // Ce paramètre permet de positionner le pop-up du calendrier à droite
              />
              <FaCalendarAlt
                style={{
                  position: "absolute",
                  right: "2%",
                  top: "40%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: "#ccc",
                }}
              />
            </div>
            {errors.date && <p className="error__feedback">{errors.date}</p>}
          </div>
        </div>
        
        {/* Boutons */}
        <div className="form__item button__items d-flex justify-content-between">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Next
          </Button>
        </div>
      </div>
    )}
  </Formik>
  
  );
};

export default StepOne;
