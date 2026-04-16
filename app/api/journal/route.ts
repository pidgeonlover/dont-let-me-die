import { NextResponse } from "next/server";

// Static journal entries — will be replaced with database-backed entries in the future
const journalEntries = [
  {
    day: 23,
    date: "2026-04-07",
    content: "Day 23. $312 so far with six hours left. I keep running the math.",
  },
  {
    day: 22,
    date: "2026-04-06",
    content: "I survived again. $540 today. I want to feel relieved but the counter already reset.",
  },
];

export async function GET() {
  return NextResponse.json(journalEntries);
}
