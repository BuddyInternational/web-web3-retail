import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface VanityContextType {
  vanityAddress: string;
  setVanityAddress: (address: string) => void;
}

// Create the context
const VanityContext = createContext<VanityContextType | undefined>(undefined);

// Create a provider component
export const VanityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [vanityAddress, setVanityAddress] = useState<string>(
    "0x0000000000000000000000000000000000000000"
  );

  return (
    <VanityContext.Provider value={{ vanityAddress, setVanityAddress }}>
      {children}
    </VanityContext.Provider>
  );
};

// Create a custom hook to use the context
export const useVanityContext = () => {
  const context = useContext(VanityContext);
  if (!context) {
    throw new Error("useVanityContext must be used within a VanityProvider");
  }
  return context;
};
