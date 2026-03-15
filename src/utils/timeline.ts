import type { HistoricalEvent, FilterState } from '../types';
import { ZOOM_LEVELS } from '../types';

export const MIN_YEAR = -3000;
export const MAX_YEAR = 2024;
export const TOTAL_YEARS = MAX_YEAR - MIN_YEAR;

export function filterEvents(events: HistoricalEvent[], filters: FilterState): HistoricalEvent[] {
  return events.filter((event) => {
    if (filters.categories.length > 0) {
      const eventCats = [event.category, ...(event.categories ?? [])];
      if (!filters.categories.some((c) => eventCats.includes(c))) return false;
    }
    if (filters.regions.length > 0 && !filters.regions.includes(event.region)) {
      return false;
    }
    if (filters.yearRange) {
      const [rangeStart, rangeEnd] = filters.yearRange;
      // Event must overlap the selected year range
      if (event.end < rangeStart || event.start > rangeEnd) return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export function yearToX(year: number, centerYear: number, zoom: number, canvasWidth: number): number {
  const zl = ZOOM_LEVELS[Math.min(zoom, ZOOM_LEVELS.length - 1)];
  const pixelsPerYear = 1 / zl.yearsPerPixel;
  return canvasWidth / 2 + (year - centerYear) * pixelsPerYear;
}

export function xToYear(x: number, centerYear: number, zoom: number, canvasWidth: number): number {
  const zl = ZOOM_LEVELS[Math.min(zoom, ZOOM_LEVELS.length - 1)];
  const pixelsPerYear = 1 / zl.yearsPerPixel;
  return centerYear + (x - canvasWidth / 2) / pixelsPerYear;
}

export function getVisibleYearRange(centerYear: number, zoom: number, canvasWidth: number): [number, number] {
  const startYear = xToYear(0, centerYear, zoom, canvasWidth);
  const endYear = xToYear(canvasWidth, centerYear, zoom, canvasWidth);
  return [startYear, endYear];
}

export function getEventsInRange(
  events: HistoricalEvent[],
  startYear: number,
  endYear: number
): HistoricalEvent[] {
  return events.filter((e) => e.end >= startYear && e.start <= endYear);
}

export function assignSwimLanes(events: HistoricalEvent[], centerYear: number, zoom: number, canvasWidth: number): Map<string, number> {
  const lanes = new Map<string, number>();
  const laneEnds: number[] = []; // tracks when each lane ends (in pixels)

  const sorted = [...events].sort((a, b) => a.start - b.start);

  for (const event of sorted) {
    const startX = yearToX(event.start, centerYear, zoom, canvasWidth);
    const eventEndYear = event.start === event.end ? event.start + 1 : event.end;
    const endX = yearToX(eventEndYear, centerYear, zoom, canvasWidth);
    const barEnd = Math.max(endX, startX + 60); // minimum 60px width

    let assignedLane = -1;
    for (let i = 0; i < laneEnds.length; i++) {
      if (laneEnds[i] <= startX - 4) { // 4px gap
        assignedLane = i;
        break;
      }
    }

    if (assignedLane === -1) {
      assignedLane = laneEnds.length;
      laneEnds.push(barEnd);
    } else {
      laneEnds[assignedLane] = barEnd;
    }

    lanes.set(event.id, assignedLane);
  }

  return lanes;
}

export function getRandomPopularEvent(events: HistoricalEvent[]): HistoricalEvent {
  // Weight by popularity
  const totalWeight = events.reduce((sum, e) => sum + e.popularityScore, 0);
  let random = Math.random() * totalWeight;
  for (const event of events) {
    random -= event.popularityScore;
    if (random <= 0) return event;
  }
  return events[events.length - 1];
}
