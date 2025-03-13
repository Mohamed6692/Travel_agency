import { createContext, useContext, useState, useEffect } from "react";
import { useApi } from "./ApiProvider";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (api.isAuthenticated()) {
        const response = await api.get("/api/auth/me");
        if (!response.error) {
          setUser(response);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    })();
  }, [api]);

  const login = async (user) => {
    const response = await api.post("/api/auth/login", user);
    if (!response.error) {
      localStorage.setItem("user", response.token);
      const me = await api.get("/api/auth/me");
      if (!me.error) {
        setUser(me);
      } else {
        setUser(null);
      }
    }
    return response;
  };

  const update = async (user) => {
    const response = await api.put("/api/auth/me/update", user);
    if (!response.error) {
      const me = await api.get("/api/auth/me");
      if (!me.error) {
        setUser(me);
      } else {
        setUser(null);
      }
    }
    return response;
  };

  const logout = async () => {
    const response = await api.post("/api/auth/logout");
    if (!response.error) {
      setUser(null);
      localStorage.removeItem("user");
    }
    return response;
  };

  return (
    <UserContext.Provider value={{ user, setUser, update, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
