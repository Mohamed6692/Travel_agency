import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "./ApiProvider";
import { useNavigate } from "react-router-dom";

const ShopContext = createContext();

export default function ShopProvider({ children }) {
  const [shops, setShops] = useState();
  const [currentShop, setCurrentShop] = useState();

  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/shops/me`);
      if (!response.error) {
        setShops(response);
        setCurrentShop(response[0]);
      }
    })();
  }, [api]);

  // useEffect(() => {
  //   navigate(`/${currentShop?._id}`);
  // }, [currentShop]);

  return (
    <ShopContext.Provider value={{ shops, currentShop, setCurrentShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShops() {
  return useContext(ShopContext);
}
