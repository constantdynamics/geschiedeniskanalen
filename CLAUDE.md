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

### Directory structure

```
src/
├── App.tsx                          # Main component: wires everything, owns FilterState
├── main.tsx                         # React entry point
├── index.css                        # Tailwind v4 + dark theme variables
├── types.ts                         # All TypeScript interfaces, configs, constants
├── version.ts                       # APP_VERSION & DATA_UPDATED
├── components/
│   ├── TimelineCanvas.tsx           # Core canvas rendering (imperative draw)
│   ├── EventDetail.tsx              # Right sidebar: selected event details
│   ├── FilterPanel.tsx              # Dropdown portal: search, category/region filters
│   ├── StatsPanel.tsx               # Left sidebar: category/region stats
│   ├── Toolbar.tsx                  # Top bar: zoom, quick nav, discover button
│   ├── Legend.tsx                   # Bottom footer: color legend
│   ├── Tooltip.tsx                  # Hover tooltip on event bars
│   └── DiscoverySpinner.tsx         # Floating FAB: random event spinner wheel
├── hooks/
│   └── useTimelineInteraction.ts    # Pan/zoom/select state (ViewState)
├── utils/
│   └── timeline.ts                  # Pure functions: coordinate math, filtering, swim lanes
└── data/
    └── events.ts                    # ~1400 HistoricalEvent objects (~28K lines)
```

### Data flow

```
src/data/events.ts          → flat array of HistoricalEvent objects (~1400 events)
src/utils/timeline.ts       → pure functions: coordinate math, filtering, swim-lane layout
src/hooks/useTimelineInteraction.ts  → all pan/zoom/select state (ViewState)
App.tsx                     → wires everything together, owns FilterState
src/components/TimelineCanvas.tsx    → draws everything onto <canvas> imperatively
```

`FilterState` (categories, regions, colorMode, searchQuery) lives in `App.tsx` and is passed down. `ViewState` (centerYear, zoom 0–6, selectedEventId) lives in `useTimelineInteraction`.

### Component hierarchy

```
App.tsx
├── FilterPanel            (portal dropdown: search, category/region toggles)
├── Toolbar                (zoom controls, quick navigation, discover button)
├── StatsPanel             (left sidebar: per-category/region counts, clickable to filter)
├── TimelineCanvas         (center: canvas rendering + hit-testing)
├── EventDetail            (right sidebar: shown when event selected)
├── Legend                 (footer: color legend for current colorMode)
├── Tooltip                (overlay: hover tooltip, follows cursor)
└── DiscoverySpinner       (floating FAB: spin-wheel for random event discovery)
```

### Canvas rendering

`TimelineCanvas` is the core component. It uses a `useEffect` that redraws the entire canvas on every render. Hit-testing for clicks/hovers is done via `hitMapRef` — a `Map<eventId, {x,y,w,h}>` bounding box registry built during each draw pass.

Swim-lane assignment (`assignSwimLanes` in `utils/timeline.ts`) packs event bars into horizontal lanes to avoid overlap. It sorts events by start year and greedily assigns the first lane that has ended.

Key rendering constants: `BAR_HEIGHT = 28px`, `BAR_GAP = 6px`, `HEADER_HEIGHT = 50px`, min bar width `60px`. Supports `devicePixelRatio` for retina displays.

### Zoom system

7 zoom levels (0–6) defined in `ZOOM_LEVELS` in `types.ts`, ranging from "Millennia" (5 years/pixel) to "Maanden" (0.02 years/pixel). Year ↔ pixel conversion: `yearToX` / `xToYear` in `utils/timeline.ts`. Timeline spans `MIN_YEAR = -3000` to `MAX_YEAR = 2024`.

### Event data schema (`src/types.ts`)

```typescript
interface HistoricalEvent {
  id: string;                 // kebab-case, unique
  name: string;
  start: number;              // year, negative = BCE
  end: number;
  category: Category;         // 'kunst'|'oorlogen'|'uitvindingen'|'wetenschap'|'ontdekkingen'|'politiek'|'religie'|'economie'|'gezondheid'|'natuur'|'sport'|'filosofie'|'architectuur'|'sociale-bewegingen'|'kolonialisme'|'media'
  region: Region;             // 'europa'|'azie'|'afrika'|'amerika'|'oceanie'
  description: string;
  image: string;              // emoji
  funFacts: string[];         // exactly 5 detailed sentences
  teaserQuestion?: string;    // optional trivia question
  popularityScore: number;    // 0–100
  uncertaintyLevel: 'exact'|'approximate'|'estimated';
  wikipediaUrl?: string;      // optional external link
  relatedEvents: string[];    // array of other event IDs
}
```

### Utility functions (`src/utils/timeline.ts`)

- `filterEvents(events, filters)` → filters by categories, regions, searchQuery
- `yearToX(year, centerYear, zoom, canvasWidth)` → converts year to pixel X
- `xToYear(x, centerYear, zoom, canvasWidth)` → inverse of yearToX
- `getVisibleYearRange(centerYear, zoom, canvasWidth)` → `[startYear, endYear]`
- `getEventsInRange(events, startYear, endYear)` → events visible in range
- `assignSwimLanes(events, centerYear, zoom, canvasWidth)` → `Map<eventId, laneNumber>`
- `getRandomPopularEvent(events)` → weighted random selection by popularityScore

### Adding events

**CRITICAL**: Before adding new events to `src/data/events.ts`, ALWAYS check that the event ID does not already exist. Run:
```bash
grep "id: 'your-event-id'" src/data/events.ts
```
Each event `id` MUST be unique. If an event with that ID already exists, either skip it or update the existing one — never create a duplicate. When adding events in bulk, deduplicate against the full existing list first. A runtime dedup guard at the bottom of `events.ts` catches any remaining duplicates and logs a warning in dev mode.

Each event must have exactly **5 funFacts** — detailed, informative sentences.

### Versioning

`src/version.ts` exports `APP_VERSION` and `DATA_UPDATED`. **Update both with every data or feature change** and communicate the new version. The version is displayed in the app header next to the title.

Note: `APP_VERSION` is also exported from `types.ts` (legacy) but `version.ts` is the canonical source.

### Color modes

Two color modes selectable in the UI: `'thema'` (by category) and `'geo'` (by region). Colors defined in `CATEGORY_CONFIG` and `REGION_CONFIG` in `types.ts`.

### Interaction model

- **Pan**: Mouse drag or single-touch drag on canvas
- **Zoom**: Mouse wheel (ctrl+wheel or large deltaY), two-finger pinch on touch
- **Select**: Click event bar (toggle); shows EventDetail sidebar
- **Hover**: Tooltip follows cursor over event bars
- **Filter**: Category/region toggles in FilterPanel & StatsPanel, text search
- **Navigate**: Quick-nav buttons in Toolbar (Oudheid, Middeleeuwen, Renaissance, etc.)
- **Discover**: DiscoverySpinner FAB → spin-wheel → random weighted event → view on timeline

## Deployment

Vite `base` is set to `/geschiedeniskanalen/` in `vite.config.ts` (required for GitHub Pages subpath).

After pushing to a `claude/*` branch, create a PR and merge it to `main` via the GitHub API. GitHub Pages auto-deploys from `main`.

**Known issue**: The auto-merge workflow uses `GITHUB_TOKEN` to merge PRs. GitHub does not trigger workflows (like the Pages deploy) for pushes made by `GITHUB_TOKEN`. If the deploy doesn't trigger after auto-merge, use the API with a PAT to merge, or manually trigger "Deploy to GitHub Pages" via `workflow_dispatch` in the Actions tab.

### GitHub Actions

- **`.github/workflows/deploy.yml`**: Deploys to GitHub Pages on push to `main` or manual `workflow_dispatch`. Runs `npm ci` → `npm run build` → deploys `dist/`.
- **`.github/workflows/auto-merge-claude.yml`**: Auto-approves and squash-merges PRs from `claude/*` branches to `main`.

### Auto-merge PRs via API

The GitHub fine-grained PAT is stored in `/root/.config/gh/hosts.yml` (oauth_token field). Read the token from there and use it for API calls:

```bash
TOKEN=$(grep oauth_token /root/.config/gh/hosts.yml | head -1 | awk '{print $2}')

# Create PR
curl -X POST "https://api.github.com/repos/constantdynamics/geschiedeniskanalen/pulls" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"title":"...","head":"claude/branch-name","base":"main"}'

# Merge PR (replace {number})
curl -X PUT "https://api.github.com/repos/constantdynamics/geschiedeniskanalen/pulls/{number}/merge" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"merge_method":"merge"}'
```

**IMPORTANT**: Always set `HTTPS_PROXY="$GLOBAL_AGENT_HTTP_PROXY"` and `HTTP_PROXY="$GLOBAL_AGENT_HTTP_PROXY"` when making curl calls to api.github.com. Always create the PR, merge it, and confirm merge was successful before telling the user they need to do anything manually.
