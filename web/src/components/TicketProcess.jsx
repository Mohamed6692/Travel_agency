import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MultiStepForm from './MultiStepForm';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
function TicketProcess() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification (par exemple, via un token dans le localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Si le token est présent, l'utilisateur est authentifié
  }, []);

  return (
    <>
      <div style={{ marginTop: '2%' }}>
        <h1 className="display-5 text-center">Réservez ici <BookOnlineIcon fontSize="large" color="primary" /></h1> 
      </div>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center', // Centrer horizontalement
          alignItems: 'center',
          marginTop: '1%',
          marginBottom: '10%',
          marginLeft: '5%',
          '& > :not(style)': {
            m: 1,
            width: 580,
            height: 228,
          },
        }}
      >
        {isAuthenticated ? (
          <MultiStepForm />
        ) : (
          <Paper
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',  // Ajouté pour empiler l'icône et le texte verticalement
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <i className="bi bi-info-circle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
          <p>
            Vous devez être connecté pour réserver un ticket. Veuillez vous connecter.
          </p>
        </Paper>
        
        )}
      </Box>
    </>
  );
}

export default TicketProcess;
