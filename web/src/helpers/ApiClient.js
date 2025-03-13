import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

export default class ApiClient {
  constructor() {
    this.base_url = BASE_API_URL;
  }

  BaseURL() {
    return this.base_url;
  }

  isAuthenticated() {
    return localStorage.getItem("user") !== null;
  }

  authToken() {
    return localStorage.getItem("user");
  }

  authHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = this.authToken();
    const isLoggedIn = !!token;
    return {
      headers: {
        Authorization: isLoggedIn ? `Bearer ${token}` : "",
      },
    };
  }

  async get(url, options = {}) {
    try {
      const resp = await axios.get(this.base_url + url, {
        ...this.authHeader(),
        ...options,
      });
      return resp.data;
    } catch (err) {
      if (err.response) {
        // Si err.response existe, on renvoie err.response.data
        return { error: err.response.data };
      } else {
        // Si err.response n'existe pas, on gère l'erreur autrement
        return { error: "Erreur de réseau ou serveur inaccessible" };
      }
    }
  }
  
  async post(url, payload = {}, options = {}) {
    try {
      const resp = await axios.post(this.base_url + url, payload, {
        ...this.authHeader(),
        ...options,
      });
      return resp.data;
    } catch (err) {
      if (err.response) {
        // Si err.response existe, on renvoie err.response.data
        return { error: err.response.data };
      } else {
        // Si err.response n'existe pas, on gère l'erreur autrement
        return { error: "Erreur de réseau ou serveur inaccessible" };
      }
    }
  }
  
  async put(url, payload = {}, options = {}) {
    try {
      const resp = await axios.put(this.base_url + url, payload, {
        ...this.authHeader(),
        ...options,
      });
      return resp.data;
    } catch (err) {
      if (err.response) {
        // Si err.response existe, on renvoie err.response.data
        return { error: err.response.data };
      } else {
        // Si err.response n'existe pas, on gère l'erreur autrement
        return { error: "Erreur de réseau ou serveur inaccessible" };
      }
    }
  }
  
  async delete(url, options = {}) {
    try {
      const resp = await axios.delete(this.base_url + url, {
        ...this.authHeader(),
        ...options,
      });
      return resp.data;
    } catch (err) {
      if (err.response) {
        // Si err.response existe, on renvoie err.response.data
        return { error: err.response.data };
      } else {
        // Si err.response n'existe pas, on gère l'erreur autrement
        return { error: "Erreur de réseau ou serveur inaccessible" };
      }
    }
  }
}  