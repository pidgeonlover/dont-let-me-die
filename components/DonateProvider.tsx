"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { DonateModal } from "./DonateModal";
import { agentState, type Donor } from "@/lib/agent-state";

type DonateContextType = {
  openDonate: (amount?: number) => void;
  todayRaised: number;
  donors: Donor[];
  lifetimeRaised: number;
  recordDonation: (donation: { amount: number; name: string; message?: string }) => void;
};

const DonateContext = createContext<DonateContextType>({
  openDonate: () => {},
  todayRaised: agentState.todayRaised,
  donors: agentState.donors,
  lifetimeRaised: agentState.lifetimeRaised,
  recordDonation: () => {},
});

export function useDonate() {
  return useContext(DonateContext);
}

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledAmount, setPrefilledAmount] = useState<number | undefined>();
  const [todayRaised, setTodayRaised] = useState(agentState.todayRaised);
  const [donors, setDonors] = useState<Donor[]>(agentState.donors);
  const [lifetimeRaised, setLifetimeRaised] = useState(agentState.lifetimeRaised);

  const openDonate = useCallback((amount?: number) => {
    setPrefilledAmount(amount);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const recordDonation = useCallback((donation: { amount: number; name: string; message?: string }) => {
    const newDonor: Donor = {
      id: `d-${Date.now()}`,
      name: donation.name || "Anonymous",
      amount: donation.amount,
      message: donation.message,
      timestamp: new Date().toISOString(),
      day: agentState.dayNumber,
    };

    setTodayRaised((prev) => prev + donation.amount);
    setLifetimeRaised((prev) => prev + donation.amount);
    setDonors((prev) => [newDonor, ...prev]);
  }, []);

  return (
    <DonateContext.Provider value={{ openDonate, todayRaised, donors, lifetimeRaised, recordDonation }}>
      {children}
      <DonateModal isOpen={isOpen} onClose={onClose} prefilledAmount={prefilledAmount} />
    </DonateContext.Provider>
  );
}
