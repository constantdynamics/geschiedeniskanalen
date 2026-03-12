import { useState, useCallback, useRef } from 'react';
import type { ViewState } from '../types';
import { ZOOM_LEVELS } from '../types';
import { MIN_YEAR, MAX_YEAR, xToYear } from '../utils/timeline';

const MAX_ZOOM = ZOOM_LEVELS.length - 1;

export function useTimelineInteraction(canvasWidth: number) {
  const [viewState, setViewState] = useState<ViewState>({
    centerYear: 1000,
    zoom: 2,
    selectedEventId: null,
  });

  const isPanning = useRef(false);
  const lastPanX = useRef(0);
  const zoomTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isZooming, setIsZooming] = useState(false);

  const clampCenter = useCallback(
    (year: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, year)),
    []
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      // Pinch zoom (ctrlKey) or regular scroll
      if (e.ctrlKey || Math.abs(e.deltaY) > 50) {
        // Zoom
        setViewState((prev) => {
          const direction = e.deltaY > 0 ? -1 : 1;
          const newZoom = Math.max(0, Math.min(MAX_ZOOM, prev.zoom + direction));

          // Zoom toward mouse position
          if (canvasWidth > 0) {
            const mouseYear = xToYear(e.offsetX, prev.centerYear, prev.zoom, canvasWidth);
            const ratio = 0.3;
            const newCenter = clampCenter(
              prev.centerYear + (mouseYear - prev.centerYear) * ratio * direction
            );
            return { ...prev, zoom: newZoom, centerYear: newCenter };
          }
          return { ...prev, zoom: newZoom };
        });
      } else {
        // Pan
        setViewState((prev) => {
          const zl = ZOOM_LEVELS[prev.zoom];
          const yearsDelta = e.deltaX * zl.yearsPerPixel * 2;
          return { ...prev, centerYear: clampCenter(prev.centerYear + yearsDelta) };
        });
      }

      setIsZooming(true);
      if (zoomTimeout.current) clearTimeout(zoomTimeout.current);
      zoomTimeout.current = setTimeout(() => setIsZooming(false), 150);
    },
    [canvasWidth, clampCenter]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isPanning.current = true;
    lastPanX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPanX.current;
      lastPanX.current = e.clientX;

      setViewState((prev) => {
        const zl = ZOOM_LEVELS[prev.zoom];
        const yearsDelta = -dx * zl.yearsPerPixel;
        return { ...prev, centerYear: clampCenter(prev.centerYear + yearsDelta) };
      });
    },
    [clampCenter]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const selectEvent = useCallback((eventId: string | null) => {
    setViewState((prev) => ({ ...prev, selectedEventId: eventId }));
  }, []);

  const navigateToYear = useCallback(
    (year: number, zoom?: number) => {
      setViewState((prev) => ({
        ...prev,
        centerYear: clampCenter(year),
        zoom: zoom ?? prev.zoom,
      }));
    },
    [clampCenter]
  );

  // Touch support
  const touchStart = useRef<{ x: number; y: number; dist: number }>({ x: 0, y: 0, dist: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanning.current = true;
      lastPanX.current = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      touchStart.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist: Math.sqrt(dx * dx + dy * dy),
      };
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isPanning.current) {
        const dx = e.touches[0].clientX - lastPanX.current;
        lastPanX.current = e.touches[0].clientX;

        setViewState((prev) => {
          const zl = ZOOM_LEVELS[prev.zoom];
          const yearsDelta = -dx * zl.yearsPerPixel;
          return { ...prev, centerYear: clampCenter(prev.centerYear + yearsDelta) };
        });
      } else if (e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = dist - touchStart.current.dist;

        if (Math.abs(delta) > 20) {
          setViewState((prev) => {
            const direction = delta > 0 ? 1 : -1;
            const newZoom = Math.max(0, Math.min(MAX_ZOOM, prev.zoom + direction));
            return { ...prev, zoom: newZoom };
          });
          touchStart.current.dist = dist;
        }
      }
    },
    [clampCenter]
  );

  const handleTouchEnd = useCallback(() => {
    isPanning.current = false;
  }, []);

  return {
    viewState,
    isZooming,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    selectEvent,
    navigateToYear,
    setViewState,
  };
}
