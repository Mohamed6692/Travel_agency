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
  { segment: 'logout', title: 'Déconnexion', icon: <LogoutIcon /> }
];

// Composant SidebarNavigation qui génère la navigation dynamique
function SidebarNavigation() {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    console.log("Déconnexion en cours...");
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Échec de la déconnexion :", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <List>
      // a voir si on peut ajouter un logo    
    </List>
  );
}

export default SidebarNavigation;
