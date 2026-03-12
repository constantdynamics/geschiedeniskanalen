export function formatYear(year) {
  if (year < 0) return `${Math.abs(year)} v.Chr.`;
  if (year === 0) return '1 v.Chr.';
  return `${year} n.Chr.`;
}

export function getYearRange(centerYear, yearsVisible) {
  return {
    start: centerYear - yearsVisible / 2,
    end: centerYear + yearsVisible / 2,
  };
}

export function isEventVisible(event, startYear, endYear) {
  return event.end >= startYear && event.start <= endYear;
}

export function getEventColor(event, colorMode, categories, regions) {
  if (colorMode === 'category') {
    return categories[event.category]?.color || '#6B7280';
  }
  return regions[event.region]?.color || '#6B7280';
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getZoomLevelForYearsVisible(yearsVisible, zoomLevels) {
  for (let i = zoomLevels.length - 1; i >= 0; i--) {
    if (yearsVisible >= zoomLevels[i].yearsVisible) {
      return zoomLevels[i];
    }
  }
  return zoomLevels[0];
}

export function getTicksForRange(startYear, endYear, tickInterval) {
  const firstTick = Math.ceil(startYear / tickInterval) * tickInterval;
  const ticks = [];
  for (let year = firstTick; year <= endYear; year += tickInterval) {
    ticks.push(year);
  }
  return ticks;
}
