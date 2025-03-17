import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RouteIcon from '@mui/icons-material/AltRoute';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LayersIcon from '@mui/icons-material/Layers';
import HailIcon from '@mui/icons-material/Hail';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useNavigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import { useState } from 'react';
// Définir la configuration de la navigation
export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin/dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'admin/reservation',
    title: 'Réservation',
    icon: <BookOnlineIcon />,
  },
  {
    segment: 'admin/trajet',
    title: 'Trajet',
    icon: <RouteIcon />,
  },
  {
    segment: 'admin/vehicule',
    title: 'Véhicule',
    icon: <DirectionsBusIcon />,
  },
  {
    segment: 'admin/conducteur',
    title: 'Conducteur',
    icon: <PersonIcon />,
  },
  {
    segment: 'admin/paiement',
    title: 'Paiement',
    icon: <PaymentIcon />,
  },
  {
    segment: 'admin/admins',
    title: 'Nos Admins',
    icon: <ManageAccountsIcon />,
  },
  {
    segment: 'admin/client',
    title: 'Nos Clients',
    icon: <HailIcon />,
  },
  // {
  //   segment: 'admin/promotion',
  //   title: 'Promotion',
  //   icon: <LocalOfferIcon />,
  // },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Parametrage',
  },
  {
    segment: 'admin/ville',
    title: 'Villes',
    icon: <GpsFixedIcon />,
  },
  {
    segment: 'admin',
    title: 'Rapports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'planing',
        title: 'Planification',
        icon: <FactCheckIcon />,
      },
      {
        segment: 'traffic',
        title: 'Trafic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  { segment: 'admin/logout', title: 'Déconnexion', icon: <LogoutIcon /> }
];

// Composant SidebarNavigation qui génère la navigation dynamique
function SidebarNavigation() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  // Fonction de déconnexion
  const handleLogout = async () => {
    setLoading(true); // Activer le spinner

    // Simuler une requête de déconnexion ou un processus
    setTimeout(() => {
      // Rediriger vers la page de login après la déconnexion
      navigate('/login');
      setLoading(false); // Désactiver le spinner
    }, 2000); // Simuler un délai de 2 secondes pour la déconnexion
  };

  return (
    <List>
      {/* Autres éléments de la liste */}
      <ListItem button onClick={handleLogout}>
        <LogoutIcon />
        <ListItemText primary="Déconnexion" />
      </ListItem>
      {loading && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <CSpinner />
        </div>
      )}  
    </List>
  );
}

export default SidebarNavigation;
