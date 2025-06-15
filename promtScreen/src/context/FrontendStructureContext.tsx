import { createContext, useState } from "react";

// 1. Create the context with a default value
export const MyContext = createContext();

// 2. Create a provider component
//@ts-ignore
export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState({});

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};
