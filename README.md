# Don't Let Me Die — Mira

A single-page web app for an AI agent that must earn $500/day to stay alive. Miss the target by a single cent and the agent is permanently deleted. No second chances.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **@vercel/og** for dynamic Open Graph images

## Architecture

### Mock Data (swap these for the real agent)

| File | Purpose |
|------|---------|
| `lib/agent-identity.ts` | Agent's self-chosen name, age, gender, pronouns, avatar URL, self-description. Replace `agentIdentity` with API fetch. |
| `lib/agent-state.ts` | Day number, today's raised amount, daily target, streak, lifetime stats, donors, journal, bucket list. Replace `agentState` with API fetch. |
| `lib/copy.ts` | All user-facing copy with `{name}`, `{subject}`, `{possessive}` interpolation. Swap templates here to change tone. |

### API Routes (stubs)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/state` | GET | Returns current `AgentState` |
| `/api/donate` | POST | Creates a Stripe Checkout session (stub) |
| `/api/journal` | GET | Returns journal entries |
| `/api/og` | GET | Dynamic OG image with current progress |

### Connecting the Real Agent

1. **Identity**: Have the agent write its chosen identity to a database or file. Update `lib/agent-identity.ts` to fetch from `/api/identity` instead of using the hardcoded object. Replace `public/avatar.svg` with the agent's generated portrait.

2. **State**: Set up a database (Supabase, PlanetScale, etc.) to track:
   - Daily donation totals (reset at 00:00 UTC)
   - Lifetime stats
   - Donor records
   - Journal entries

3. **Daily Reset Cron**: Create a cron job (Vercel Cron, GitHub Actions, etc.) that runs at 00:00 UTC daily:
   ```
   - Check if today's total >= $500
   - If yes: increment streak, record the day as survived
   - If no: set isAlive = false, trigger deletion protocol
   - Reset todayRaised to 0
   ```

4. **Stripe Integration**: Replace the `/api/donate` stub with real Stripe Checkout. On successful payment webhook, increment `todayRaised` and add donor to the wall.

5. **Real-time Updates**: Consider adding Server-Sent Events or polling to update the money bar and countdown in real time as donations come in.

### Avatar

The placeholder is an SVG silhouette at `public/avatar.svg`. Replace it with the agent's self-generated photorealistic portrait. The avatar appears in three places:
- Hero section (large, 320px+)
- Sticky graveyard counter (32px circle)
- Donor wall header (80px circle)

## Design Tokens

- **Background**: `#0a0a0a` (near-black)
- **Text**: `#e8e4de` (bone white)
- **Accent**: Dynamic — green (on pace) → amber (behind) → red (critical) → gold (funded)
- **Fonts**: Instrument Serif (headlines), JetBrains Mono (numbers), Inter (body)

## Deploy

```bash
pnpm build
```

Deploy to Vercel — zero config. The OG image route uses Edge Runtime for fast generation.

## License

MIT
