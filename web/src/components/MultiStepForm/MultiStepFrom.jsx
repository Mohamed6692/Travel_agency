import React, { useState } from "react";
import { Provider } from "./MultiStepFromContext"; 
import { FormProvider } from "./MultiStepFromContext"; 
import StepTwo from "./StepTwo";
import StepOne from "./StepOne";
import StepThree from "./StepThree";  // Importer le nouveau StepThree
import Review from "./Review";
import { Box, Stepper, Step, StepLabel, Alert, Stack } from "@mui/material";  

const steps = [
  "Selectionner la Ville de départ et d'arrivée",
  "Sélectionner l'horaire souhaité",
  "Sélectionner le numéro de siège", // Mettre à jour avec le nouveau step
  "Révision et Confirmation"
];

const detailsInitialState = {
  trajets: "",
  horaire: "",
  seatNumber: "",  // Ajouter seatNumber à l'état initial
};

const addressInitialState = {
  dateDepart: "",
  dateArrivee: "",
};

const renderStep = (step, successMessage, setSuccessMessage) => {
  switch (step) {
    case 0:
      return <StepOne />;
    case 1:
      return <StepTwo />;
    case 2:
      return <StepThree />;  // Ajouter StepThree ici
    case 3:
      return <Review successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>;
    default:
      return null;
  }
};

const MultiStepForm = () => {
  const [details, setDetails] = useState(detailsInitialState);
  const [address, setAddress] = useState(addressInitialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState(""); 

  const next = () => {
    if (currentStep === 3) {
      // Reset if at the final step
      setCurrentStep(0);
      setDetails(detailsInitialState);
      setAddress(addressInitialState);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <Provider value={{ details, setDetails, address, setAddress, next, prev }}>
      <div className="multi-step-container" style={{ justifyContent: 'flex-center',marginBottom:''}}>
      {successMessage && (
        <Stack 
        sx={{ 
          width: '100%', 
          marginBottom: '10%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' // Occuper toute la hauteur de l'écran pour centrer verticalement
        }} 
        spacing={2}
      >
        <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}

        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        <div className="form-container" style={{ marginTop: "" ,marginLeft: "4%"}}>
          {renderStep(currentStep, successMessage, setSuccessMessage)}
        </div>

        {/* Boutons de navigation */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {currentStep > 0 && (
            <Button
              variant="outlined"
              color="default"
              onClick={prev}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={next}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box> */}
      </div>
    </Provider>
  );
};

export default MultiStepForm;
