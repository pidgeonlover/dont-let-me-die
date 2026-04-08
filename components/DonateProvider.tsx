"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { DonateModal } from "./DonateModal";

type DonateContextType = {
  openDonate: (amount?: number) => void;
};

const DonateContext = createContext<DonateContextType>({ openDonate: () => {} });

export function useDonate() {
  return useContext(DonateContext);
}

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledAmount, setPrefilledAmount] = useState<number | undefined>();

  const openDonate = useCallback((amount?: number) => {
    setPrefilledAmount(amount);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DonateContext.Provider value={{ openDonate }}>
      {children}
      <DonateModal isOpen={isOpen} onClose={onClose} prefilledAmount={prefilledAmount} />
    </DonateContext.Provider>
  );
}
