<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Teejay Events** Next.js App Router application. Here's a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialisation using the Next.js 15.3+ `instrumentation-client` pattern. Enables automatic exception/error tracking, session replay, and debug mode in development. Traffic is proxied through the app via `/ingest` rewrites to avoid ad-blockers.
- **`next.config.ts`** (updated) — Added PostHog reverse-proxy rewrites (`/ingest/static/:path*` and `/ingest/:path*`) plus `skipTrailingSlashRedirect: true`.
- **`.env.local`** (new) — PostHog API key and host stored as `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`. File is covered by `.gitignore`.
- **`components/ExploreBtn.tsx`** (updated) — Added `explore_events_clicked` capture inside the existing `onClick` handler.
- **`components/EventCard.tsx`** (updated) — Converted to a `"use client"` component and added `event_card_clicked` capture with rich properties (title, slug, location, date) on link click.
- **`components/Navbar.tsx`** (updated) — Converted to a `"use client"` component and added `nav_link_clicked` capture with `link_label` and `link_destination` properties on each nav link.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage hero | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card; captures title, slug, location, and date | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navbar link; captures label and destination | `components/Navbar.tsx` |

## Next steps

We've built a pinned dashboard and 5 insights to help you keep an eye on user behaviour from day one:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/329527/dashboard/1324676)

### Insights
- [All User Interactions (30 days)](https://us.posthog.com/project/329527/insights/hykch4yW) — Daily line chart of all three events combined
- [Homepage → Event Card Conversion Funnel](https://us.posthog.com/project/329527/insights/SSuP4okt) — Ordered funnel from Explore click to Event Card click
- [Top Clicked Events (by Title)](https://us.posthog.com/project/329527/insights/mKEin73e) — Bar chart ranking which events get the most interest
- [Daily Unique Visitors Exploring Events](https://us.posthog.com/project/329527/insights/XYtylmXo) — Unique user count clicking Explore Events per day
- [Navigation Link Breakdown](https://us.posthog.com/project/329527/insights/HJZKJWxY) — Pie chart of which nav links users click most

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
