import React, { useContext,useState } from "react";
import { useNavigate,useLocation } from 'react-router-dom'; // Import pour la redirection
import { useEffect } from 'react';
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import MultiStepFromContext from "./MultiStepFromContext";
import { set } from "date-fns";
import { Typography } from "@mui/material";
import axios from 'axios';

const cities = ["Abidjan", "Bouaké", "Korhogo", "Yamoussoukro"];
const tarifs = {
  "Abidjan-Bouaké": 15000,
  "Abidjan-Korhogo": 25000,
  "Abidjan-Yamoussoukro": 10000,
  "Bouaké-Abidjan": 15000,
  "Bouaké-Korhogo": 12000,
  "Bouaké-Yamoussoukro": 8000,
  "Korhogo-Abidjan": 25000,
  "Korhogo-Bouaké": 12000,
  "Korhogo-Yamoussoukro": 18000,
  "Yamoussoukro-Abidjan": 10000,
  "Yamoussoukro-Bouaké": 8000,
  "Yamoussoukro-Korhogo": 18000,
};


const StepOne = () => {
  const { address, setAddress,setSeatNumbers, next } = useContext(MultiStepFromContext);
  const [trajets, setTrajets] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedTarif, setSelectedTarif] = useState(null);
  const [selectedHoraires, setSelectedHoraires] = useState([]);

 
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+"/api/trajet/all-no-pagination")
      .then((response) => {
        if (response.data.success) {
          setTrajets(response.data.trajets);
          setDepartureCities([...new Set(response.data.trajets.map((t) => t.origine))]);
        }
      })
      .catch((error) => console.error("Erreur lors du chargement des trajets:", error));
  }, []);

  useEffect(() => {
    if (selectedDeparture && address.arrivalCity && address.date) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/reservation/seatReservation?departureCity=${address.departureCity}&arrivalCity=${address.arrivalCity}&date=${address.date}`)
        .then((response) => {
          if (response.data.success) {
            const reservedSeats = response.data.reservations.map((seat) => seat.toString());
            const selectedTrajet = trajets.find(
              (t) => t.origine === address.departureCity && t.destination === address.arrivalCity
            );
            const capacite = selectedTrajet?.vehicule_id?.capacite || 0;
            const allSeats = Array.from({ length: capacite }, (_, i) => i + 1);
            const availableSeats = allSeats.filter((seat) => !reservedSeats.includes(seat.toString()));

            setSeatNumbers(availableSeats);
          }
        })
        .catch((error) => console.error("Erreur lors de la récupération des sièges réservés :", error));
    }
  }, [address.departureCity, address.arrivalCity, address.date, trajets]);

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
    }
  };




  return (
    <Formik
    initialValues={{ ...address, tarif: "", horaires: [] }}
      onSubmit={(values) => {
        setAddress(values);
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.departureCity) errors.departureCity = "Ville de départ requise";
        if (!values.arrivalCity) errors.arrivalCity = "Ville d'arrivée requise";
        if (!values.date) {
          errors.date = "Veuillez sélectionner une date";
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
          <div className="form__row" style={{ display: "flex", gap: "1rem" }}>
            {/* Sélection de la ville de départ */}
            <div className={`form__item ${errors.departureCity && "input__error"}`} style={{ flex: 1 }}>
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
              <p className="error__feedback">{errors.departureCity}</p>
            </div>

            {/* Sélection de la ville d'arrivée */}
            <div className={`form__item ${errors.arrivalCity && "input__error"}`} style={{ flex: 1 }}>
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
              <p className="error__feedback">{errors.arrivalCity}</p>
            </div>

            {/* Sélection de la date */}
            <div className={`form__item ${errors.date && "input__error"}`} style={{ flex: 1 }}>
              <label>Date du voyage *</label>
              <div className="date-input-wrapper" style={{ position: "relative" }}>
                <DatePicker
                  selected={values.date ? new Date(values.date) : null}
                  onChange={(date) => setFieldValue("date", date ? date.toISOString() : "")}
                  className="form-control"
                  placeholderText="Date/"
                />
                <FaCalendarAlt
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#ccc",
                  }}
                />
              </div>
              <p className="error__feedback">{errors.date}</p>
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
