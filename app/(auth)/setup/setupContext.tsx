"use client";

import { createContext, useContext, ReactNode } from "react";

interface SetupContextProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  lastStep: boolean;
}

const SetupContext = createContext<SetupContextProps | undefined>(undefined);

export const useSetupContext = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetupContext must be used within a SetupProvider");
  }
  return context;
};

interface SetupProviderProps {
  children: ReactNode;
  value: SetupContextProps;
}

export const SetupProvider = ({ children, value }: SetupProviderProps) => {
  return (
    <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
  );
};
