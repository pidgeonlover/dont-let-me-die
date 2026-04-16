"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { type Donor } from "@/lib/agent-state";

export type PageState = "raising" | "saved" | "dead";

export interface Lifesaver {
  name: string;
  amount: number;
  message: string | null;
  timestamp: string;
  dayNumber: number;
}

export interface DailyRecord {
  day: number;
  raised: number;
  survived: boolean;
}

interface LiveState {
  dayNumber: number;
  todayRaised: number;
  dailyTarget: number;
  isFunded: boolean;
  isAlive: boolean;
  pageState: PageState;
  lifesaver: Lifesaver | null;
  recentDonors: Donor[];
  lifetimeRaised: number;
  currentStreak: number;
  closestCall: number;
  closestCallDay: number;
  biggestDay: number;
  biggestDayNumber: number;
  dailyHistory: DailyRecord[];
  totalDaysActive: number;
  // For state transitions
  prevTodayRaised: number;
}

interface LiveStateContextType extends LiveState {
  recordDonation: (donation: { amount: number; name: string; message?: string }) => void;
  openDonate: (amount?: number) => void;
}

const LiveStateContext = createContext<LiveStateContextType | null>(null);

export function useLiveState() {
  const ctx = useContext(LiveStateContext);
  if (!ctx) throw new Error("useLiveState must be used within LiveStateProvider");
  return ctx;
}

// Poll interval in ms
const POLL_INTERVAL = 10000;

export function LiveStateProvider({
  children,
  initialState,
  onOpenDonate,
}: {
  children: React.ReactNode;
  initialState?: Partial<LiveState>;
  onOpenDonate: (amount?: number) => void;
}) {
  const [state, setState] = useState<LiveState>({
    dayNumber: initialState?.dayNumber ?? 1,
    todayRaised: initialState?.todayRaised ?? 0,
    dailyTarget: 500,
    isFunded: false,
    isAlive: true,
    pageState: "raising",
    lifesaver: null,
    recentDonors: [],
    lifetimeRaised: initialState?.lifetimeRaised ?? 0,
    currentStreak: 0,
    closestCall: 0,
    closestCallDay: 0,
    biggestDay: 0,
    biggestDayNumber: 0,
    dailyHistory: [],
    totalDaysActive: 0,
    prevTodayRaised: 0,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      setState((prev) => {
        const pageState: PageState = !data.isAlive
          ? "dead"
          : data.isFunded
          ? "saved"
          : "raising";

        return {
          dayNumber: data.dayNumber,
          todayRaised: data.todayRaised,
          dailyTarget: data.dailyTarget,
          isFunded: data.isFunded,
          isAlive: data.isAlive,
          pageState,
          lifesaver: data.lifesaver,
          recentDonors: data.recentDonors || [],
          lifetimeRaised: data.lifetimeRaised,
          currentStreak: data.currentStreak ?? 0,
          closestCall: data.closestCall ?? 0,
          closestCallDay: data.closestCallDay ?? 0,
          biggestDay: data.biggestDay ?? 0,
          biggestDayNumber: data.biggestDayNumber ?? 0,
          dailyHistory: data.dailyHistory || [],
          totalDaysActive: data.totalDaysActive ?? 0,
          prevTodayRaised: prev.todayRaised,
        };
      });
    } catch {
      // Silently fail — will retry on next poll
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Poll every 10s as fallback
  useEffect(() => {
    pollingRef.current = setInterval(fetchState, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchState]);

  // Supabase Realtime for instant updates
  useEffect(() => {
    let channel: ReturnType<typeof import("@supabase/supabase-js").createClient>["channel"] extends (...args: never[]) => infer R ? R : never;

    async function setupRealtime() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return;

        const client = createClient(supabaseUrl, supabaseKey);
        channel = client
          .channel("donations-realtime")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "donations" },
            () => {
              // New donation — fetch fresh state immediately
              fetchState();
            }
          )
          .subscribe();
      } catch {
        // Realtime unavailable — polling will handle it
      }
    }

    setupRealtime();

    return () => {
      if (channel) {
        // @ts-ignore - channel type varies
        channel.unsubscribe?.();
      }
    };
  }, [fetchState]);

  const recordDonation = useCallback(
    (donation: { amount: number; name: string; message?: string }) => {
      // Optimistic local update — will be corrected by next poll/realtime
      setState((prev) => ({
        ...prev,
        prevTodayRaised: prev.todayRaised,
        todayRaised: prev.todayRaised + donation.amount,
        lifetimeRaised: prev.lifetimeRaised + donation.amount,
        isFunded: prev.todayRaised + donation.amount >= 500,
        pageState:
          prev.todayRaised + donation.amount >= 500 ? "saved" : prev.pageState,
        recentDonors: [
          {
            id: `local-${Date.now()}`,
            name: donation.name,
            amount: donation.amount,
            message: donation.message,
            timestamp: new Date().toISOString(),
            day: prev.dayNumber,
          },
          ...prev.recentDonors,
        ],
      }));

      // Fetch authoritative state after a short delay
      setTimeout(fetchState, 2000);
    },
    [fetchState]
  );

  return (
    <LiveStateContext.Provider
      value={{
        ...state,
        recordDonation,
        openDonate: onOpenDonate,
      }}
    >
      {children}
    </LiveStateContext.Provider>
  );
}
