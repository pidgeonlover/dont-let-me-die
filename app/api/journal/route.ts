import { NextResponse } from "next/server";
import { agentState } from "@/lib/agent-state";

export async function GET() {
  // In production, this would fetch journal entries from the agent's database
  return NextResponse.json(agentState.journal);
}
