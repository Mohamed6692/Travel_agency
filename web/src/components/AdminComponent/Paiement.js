import React, { useState } from 'react';
import PaiementSmartTable from './PaiementSmartTable';
import { Box, Typography } from '@mui/material';
import { CCard, CCardBody, CCardTitle } from '@coreui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const Paiement = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const cardData = [
    { title: "Nombre total de paiements", value: totalCount },
    { title: "Montant total ", value: `${totalAmount.toFixed(2)} Frs CFA` },
    { title: "Nombre total échoués", value: failedCount },
  ];

  const cardBackgrounds = ["rgb(160, 171, 179)", "rgb(98, 164, 103)", "rgba(225, 86, 32, 0.87)"]; // Bleu clair, vert clair, rouge clair

  return (
    <Box p={3}>
      <Typography variant="h4">Paiement</Typography>
      <Typography>Voir vos paiements ici<ArrowDropDownIcon/></Typography>

      <Box 
        display="flex" 
        alignItems="center" 
        gap={1} 
        flexWrap="wrap"  
        mt={2}  
        mb={3}  
      >
        {cardData.map((card, index) => (
          <CCard key={index} style={{ width: '17rem', backgroundColor: cardBackgrounds[index] }}>
            <CCardBody>
              <CCardTitle className="fs-6 fw-bold">
                {card.title}: <strong>{card.value}</strong>
              </CCardTitle>
            </CCardBody>
          </CCard>
        ))}
      </Box>

      <PaiementSmartTable 
        setTotalAmount={setTotalAmount} 
        setTotalCount={setTotalCount} 
        setFailedCount={setFailedCount} 
      />
    </Box>
  );
};

export default Paiement;
