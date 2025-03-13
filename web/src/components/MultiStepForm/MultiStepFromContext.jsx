import { createContext ,useState} from "react";

const FormContext = createContext({});

export const FormProvider = ({ children }) => {
    const [successMessage, setSuccessMessage] = useState(""); // Ajouter successMessage ici
  
    return (
      <FormContext.Provider value={{ successMessage, setSuccessMessage }}>
        {children}
      </FormContext.Provider>
    );
  };
  
export default FormContext;

export const { Provider, Consumer } = FormContext;
