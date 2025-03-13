import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION } from './AdminComponent/SidebarNavigation';  // Assure-toi d'importer correctement NAVIGATION
import { useLocation } from 'react-router-dom';

// Import des composants
import Dashboard from './AdminComponent/Dashboard';
import Reservation from './AdminComponent/Reservation';
import Trajet from './AdminComponent/Trajet';
import Vehicule from './AdminComponent/Vehicule';
import Conducteur from './AdminComponent/Conducteur';
import Paiement from './AdminComponent/Paiement';
import Promotion from './AdminComponent/Promotion';
import SidebarNavigation from './AdminComponent/SidebarNavigation';
import Ville from './AdminComponent/Ville';
import Client from './AdminComponent/Client';
import Admin from './AdminComponent/Admin';
import Planification from './AdminComponent/Planification';


// Définir le thème
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Composant de contenu de page pour le Dashboard
function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

// Composant principal pour le DashboardAdmin
function DashboardAdmin(props) {
  const { window } = props;
  // console.log("Navigation Items:", NAVIGATION);


  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      window={window}
      branding={{
        title: '',
        logo: <img src="/img/logoraf.jpg" alt="Custom Logo" style={{ width: '100px', height: '50px' }} />,
      }}
    >
      <DashboardLayout>
        
           {/* Sidebar avec la navigation dynamique */}
          <Routes>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservation" element={<Reservation />} />
            <Route path="trajet" element={<Trajet />} />
            <Route path="vehicule" element={<Vehicule />} />
            <Route path="conducteur" element={<Conducteur />} />
            <Route path="paiement" element={<Paiement />} />
            <Route path="promotion" element={<Promotion />} />
            <Route path="ville" element={<Ville />} />
            <Route path="client" element={<Client />} />
            <Route path="admins" element={<Admin />} />
            <Route path="planing" element={<Planification/>}/>
          </Routes>
        
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardAdmin.propTypes = {
  window: PropTypes.func,
};

export default DashboardAdmin;
