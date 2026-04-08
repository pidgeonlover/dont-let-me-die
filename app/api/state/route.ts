import { NextResponse } from "next/server";
import { agentState } from "@/lib/agent-state";

export async function GET() {
  // In production, this would fetch live state from the agent's database
  return NextResponse.json(agentState);
}
