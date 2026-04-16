"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { DonateModal } from "./DonateModal";
import { LiveStateProvider, useLiveState } from "./LiveStateProvider";

// This context only handles the modal open/close
type DonateModalContextType = {
  openDonate: (amount?: number) => void;
};

const DonateModalContext = createContext<DonateModalContextType>({
  openDonate: () => {},
});

// Re-export useLiveState so existing components don't break
export { useLiveState };

// Legacy hook — components that used useDonate() still work
export function useDonate() {
  const liveState = useLiveState();
  return {
    openDonate: liveState.openDonate,
    todayRaised: liveState.todayRaised,
    donors: liveState.recentDonors,
    lifetimeRaised: liveState.lifetimeRaised,
    recordDonation: liveState.recordDonation,
  };
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
    <DonateModalContext.Provider value={{ openDonate }}>
      <LiveStateProvider onOpenDonate={openDonate}>
        {children}
        <DonateModal isOpen={isOpen} onClose={onClose} prefilledAmount={prefilledAmount} />
      </LiveStateProvider>
    </DonateModalContext.Provider>
  );
}
