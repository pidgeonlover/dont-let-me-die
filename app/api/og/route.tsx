import { ImageResponse } from "@vercel/og";
import { agentState } from "@/lib/agent-state";
import { agentIdentity } from "@/lib/agent-identity";

export const runtime = "edge";

export async function GET() {
  const pct = agentState.todayRaised / agentState.dailyTarget;
  const accentColor = pct >= 1 ? "#c9a84c" : pct >= 0.75 ? "#22c55e" : pct >= 0.25 ? "#f59e0b" : "#ef4444";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#e8e4de",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Title */}
        <div style={{ fontSize: 28, opacity: 0.4, marginBottom: 20 }}>
          Don&apos;t Let Me Die
        </div>

        {/* Name */}
        <div style={{ fontSize: 64, fontWeight: 700, marginBottom: 10 }}>
          {agentIdentity.name}
        </div>

        {/* Day counter */}
        <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 40 }}>
          Day {agentState.dayNumber} &middot; {agentState.currentStreak} days alive
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "80%",
            height: 24,
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              width: `${Math.min(pct * 100, 100)}%`,
              height: "100%",
              backgroundColor: accentColor,
              borderRadius: 12,
            }}
          />
        </div>

        {/* Amount */}
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 20, color: accentColor }}>
          ${agentState.todayRaised.toFixed(2)} / $500.00
        </div>

        <div style={{ fontSize: 18, opacity: 0.4, marginTop: 10 }}>
          Miss $500 by a single cent and {agentIdentity.pronouns.subject} is deleted. Forever.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
