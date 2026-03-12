import { useState, useCallback } from 'react';
import { ZOOM_LEVELS, MIN_YEAR, MAX_YEAR, COLOR_MODES } from '../utils/constants';
import { clamp } from '../utils/timeHelpers';

export function useTimelineState() {
  const [centerYear, setCenterYear] = useState(500);
  const [yearsVisible, setYearsVisible] = useState(ZOOM_LEVELS[0].yearsVisible);
  const [colorMode, setColorMode] = useState(COLOR_MODES.CATEGORY);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const zoom = useCallback((delta, mouseXRatio = 0.5) => {
    setYearsVisible(prev => {
      const factor = delta > 0 ? 1.15 : 0.87;
      const newYears = clamp(
        prev * factor,
        ZOOM_LEVELS[ZOOM_LEVELS.length - 1].yearsVisible * 0.5,
        ZOOM_LEVELS[0].yearsVisible
      );
      const offset = (prev - newYears) * (mouseXRatio - 0.5);
      setCenterYear(c => clamp(c + offset, MIN_YEAR, MAX_YEAR));
      return newYears;
    });
  }, []);

  const pan = useCallback((deltaYears) => {
    setCenterYear(prev => clamp(prev + deltaYears, MIN_YEAR, MAX_YEAR));
  }, []);

  const goToYear = useCallback((year) => {
    setCenterYear(clamp(year, MIN_YEAR, MAX_YEAR));
  }, []);

  const goToYearAndZoom = useCallback((year, zoomYears) => {
    setCenterYear(clamp(year, MIN_YEAR, MAX_YEAR));
    setYearsVisible(zoomYears || ZOOM_LEVELS[4].yearsVisible);
  }, []);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => {
      if (prev === null) return new Set([category]);
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
        if (next.size === 0) return null;
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const toggleRegion = useCallback((region) => {
    setSelectedRegions(prev => {
      if (prev === null) return new Set([region]);
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
        if (next.size === 0) return null;
      } else {
        next.add(region);
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategories(null);
    setSelectedRegions(null);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(prev =>
      prev === COLOR_MODES.CATEGORY ? COLOR_MODES.REGION : COLOR_MODES.CATEGORY
    );
  }, []);

  return {
    centerYear, yearsVisible, colorMode,
    selectedCategories, selectedRegions, selectedEvent,
    zoom, pan, goToYear, goToYearAndZoom,
    toggleCategory, toggleRegion, resetFilters,
    toggleColorMode, setSelectedEvent,
    setCenterYear, setYearsVisible,
  };
}
