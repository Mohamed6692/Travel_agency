import React from 'react';
import { Box, Typography } from '@mui/material';
import { DashbordFlux } from './DashbordFlux';
import InsightsIcon from '@mui/icons-material/Insights';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
const Dashboard = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" style={{ marginBottom: '1%' ,fontSize: '1.5rem',fontWeight: 'bold' }}>
        Dashboard / Accueil <SpaceDashboardIcon/>
      </Typography>
      <Typography 
          style={{  marginBottom: '1%',fontWeight: 'bold', color: 'green', fontSize: '1.2rem' ,textDecoration: 'underline' }}>
          Vos rapports et statistiques
       </Typography>

      <DashbordFlux />
    </Box>
  );
};

export default Dashboard;
