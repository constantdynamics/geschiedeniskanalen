# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

There are no tests.

## Architecture

This is a single-page React + TypeScript app that renders an interactive historical timeline using an HTML5 **Canvas** (not DOM elements). Stack: Vite, React 19, Tailwind CSS v4, D3 (for scale utilities), Lucide icons.

### Data flow

```
src/data/events.ts          → flat array of HistoricalEvent objects (~1500+ events)
src/utils/timeline.ts       → pure functions: coordinate math, filtering, swim-lane layout
src/hooks/useTimelineInteraction.ts  → all pan/zoom/select state (ViewState)
App.tsx                     → wires everything together, owns FilterState
src/components/TimelineCanvas.tsx    → draws everything onto <canvas> imperatively
```

`FilterState` (categories, regions, colorMode, searchQuery) lives in `App.tsx` and is passed down. `ViewState` (centerYear, zoom 0–6, selectedEventId) lives in `useTimelineInteraction`.

### Canvas rendering

`TimelineCanvas` is the core component. It uses a `useEffect` that redraws the entire canvas on every render. Hit-testing for clicks/hovers is done via `hitMapRef` — a `Map<eventId, {x,y,w,h}>` bounding box registry built during each draw pass.

Swim-lane assignment (`assignSwimLanes` in `utils/timeline.ts`) packs event bars into horizontal lanes to avoid overlap. It sorts events by start year and greedily assigns the first lane that has ended.

### Zoom system

7 zoom levels (0–6) defined in `ZOOM_LEVELS` in `types.ts`, ranging from "Millennia" (5 years/pixel) to "Maanden" (0.02 years/pixel). Year ↔ pixel conversion: `yearToX` / `xToYear` in `utils/timeline.ts`. Timeline spans `MIN_YEAR = -3000` to `MAX_YEAR = 2024`.

### Event data schema (`src/types.ts`)

```typescript
interface HistoricalEvent {
  id: string;           // kebab-case, unique
  name: string;
  start: number;        // year, negative = BCE
  end: number;
  category: Category;   // 'kunst'|'oorlogen'|'uitvindingen'|'ontdekkingen'|'leiders'|'personen'|'economie'
  region: Region;       // 'europa'|'azie'|'afrika'|'amerika'|'oceanie'
  description: string;
  image: string;        // emoji
  funFacts: string[];   // exactly 2 strings
  popularityScore: number; // 0–100
  uncertaintyLevel: 'exact'|'approximate'|'uncertain';
  relatedEvents: string[]; // array of other event IDs
}
```

### Versioning

`src/version.ts` exports `APP_VERSION`. **Update this with every data or feature change** and communicate the new version. The version is displayed in the app header next to the title.

### Color modes

Two color modes selectable in the UI: `'thema'` (by category) and `'geo'` (by region). Colors defined in `CATEGORY_CONFIG` and `REGION_CONFIG` in `types.ts`.
