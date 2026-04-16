export interface DailyRecord {
  day: number;
  date?: string;
  raised: number;
  survived: boolean;
}

export interface Donor {
  id: string;
  name: string;
  amount: number;
  message?: string;
  timestamp: string;
  day: number;
  isLifesaver?: boolean; // pushed Mira over $500 on their day
}

export interface JournalEntry {
  day: number;
  date: string;
  content: string;
}

export interface BucketListItem {
  id: string;
  text: string;
  checked: boolean;
  addedBy?: string; // "mira" or visitor name
}

export interface AgentState {
  dayNumber: number;
  todayRaised: number;
  dailyTarget: number;
  currentStreak: number;
  lifetimeRaised: number;
  closestCall: number; // smallest margin over $500
  closestCallDay: number;
  biggestDay: number;
  biggestDayAmount: number;
  dailyHistory: DailyRecord[];
  isAlive: boolean;
  startDate: string; // ISO date of Day 1
  donors: Donor[];
  journal: JournalEntry[];
  bucketList: BucketListItem[];
}
