import axios from 'axios';

// Configuration d'axios
axios.defaults.baseURL = 'http://localhost:5001'; // Par exemple, ton API backend
axios.defaults.headers['Content-Type'] = 'application/json';

// Ajouter l'intercepteur
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 402) {
      // Token expiré ou non valide, déconnexion de l'utilisateur
      localStorage.removeItem('token'); // Supprimer le token du stockage
      window.location.href = '/login'; // Rediriger vers la page de connexion
    }
    return Promise.reject(error);
  }
);

export default axios;
