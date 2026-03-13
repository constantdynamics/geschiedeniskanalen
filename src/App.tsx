import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { HistoricalEvent, FilterState } from './types';
import { ZOOM_LEVELS } from './types';
import { historicalEvents } from './data/events';
import { filterEvents, getRandomPopularEvent } from './utils/timeline';
import { useTimelineInteraction } from './hooks/useTimelineInteraction';
import TimelineCanvas from './components/TimelineCanvas';
import Toolbar from './components/Toolbar';
import FilterPanel from './components/FilterPanel';
import Legend from './components/Legend';
import EventDetail from './components/EventDetail';
import Tooltip from './components/Tooltip';
import DiscoverySpinner from './components/DiscoverySpinner';
import { Clock } from 'lucide-react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    regions: [],
    colorMode: 'thema',
    searchQuery: '',
  });

  const [tooltip, setTooltip] = useState<{
    event: HistoricalEvent;
    x: number;
    y: number;
  } | null>(null);

  const {
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
  } = useTimelineInteraction(dimensions.width);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Wheel handler (needs to be on the DOM element directly for passive: false)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const filteredEvents = useMemo(
    () => filterEvents(historicalEvents, filters),
    [filters]
  );

  const selectedEvent = useMemo(
    () => viewState.selectedEventId
      ? historicalEvents.find((e) => e.id === viewState.selectedEventId) ?? null
      : null,
    [viewState.selectedEventId]
  );

  const handleEventClick = useCallback(
    (eventId: string) => {
      selectEvent(viewState.selectedEventId === eventId ? null : eventId);
    },
    [selectEvent, viewState.selectedEventId]
  );

  const handleEventHover = useCallback(
    (event: HistoricalEvent | null, x: number, y: number) => {
      if (event) {
        setTooltip({ event, x, y });
      } else {
        setTooltip(null);
      }
    },
    []
  );

  const handleNavigateToEvent = useCallback(
    (eventId: string) => {
      const event = historicalEvents.find((e) => e.id === eventId);
      if (event) {
        const center = (event.start + event.end) / 2;
        navigateToYear(center, Math.max(viewState.zoom, 3));
        selectEvent(eventId);
      }
    },
    [navigateToYear, selectEvent, viewState.zoom]
  );

  const handleRandomEvent = useCallback(() => {
    const event = getRandomPopularEvent(filteredEvents);
    handleNavigateToEvent(event.id);
  }, [filteredEvents, handleNavigateToEvent]);

  const handleDiscoverySelect = useCallback(
    (event: HistoricalEvent) => {
      handleNavigateToEvent(event.id);
    },
    [handleNavigateToEvent]
  );

  const handleZoomIn = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, ZOOM_LEVELS.length - 1),
    }));
  }, [setViewState]);

  const handleZoomOut = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 0),
    }));
  }, [setViewState]);

  return (
    <div className="h-screen w-screen flex flex-col bg-surface overflow-hidden">
      {/* Header bar */}
      <header className="flex items-center gap-4 px-4 py-2.5 bg-surface-light/80 backdrop-blur-md border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          <h1 className="text-base font-bold text-text-primary tracking-tight">
            Tijdlijn<span className="text-blue-400">.</span>
          </h1>
        </div>

        <div className="h-5 w-px bg-border" />

        <FilterPanel filters={filters} onChange={setFilters} events={historicalEvents} filteredCount={filteredEvents.length} />

        <div className="flex-1">
          <Toolbar
            centerYear={viewState.centerYear}
            zoom={viewState.zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onNavigateToYear={navigateToYear}
            onRandomEvent={handleRandomEvent}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Timeline canvas area */}
        <div
          ref={containerRef}
          className="flex-1 relative cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <TimelineCanvas
              events={filteredEvents}
              centerYear={viewState.centerYear}
              zoom={viewState.zoom}
              colorMode={filters.colorMode}
              selectedEventId={viewState.selectedEventId}
              onEventClick={handleEventClick}
              onEventHover={handleEventHover}
              width={dimensions.width}
              height={dimensions.height}
            />
          )}

          {/* Empty state */}
          {filteredEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-text-secondary text-sm">Geen events gevonden met huidige filters.</p>
                <button
                  onClick={() => setFilters({ categories: [], regions: [], colorMode: filters.colorMode, searchQuery: '' })}
                  className="mt-2 text-blue-400 text-sm hover:underline"
                >
                  Wis filters
                </button>
              </div>
            </div>
          )}

          {/* Loading overlay during zoom */}
          {isZooming && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-surface-light/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border text-xs text-text-secondary">
              {ZOOM_LEVELS[viewState.zoom]?.label}
            </div>
          )}
        </div>

        {/* Event detail sidebar */}
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            allEvents={historicalEvents}
            onClose={() => selectEvent(null)}
            onNavigateToEvent={handleNavigateToEvent}
          />
        )}
      </div>

      {/* Legend */}
      <Legend colorMode={filters.colorMode} />

      {/* Tooltip */}
      {tooltip && !selectedEvent && (
        <Tooltip event={tooltip.event} x={tooltip.x} y={tooltip.y} />
      )}

      {/* Discovery Spinner FAB */}
      <DiscoverySpinner events={historicalEvents} onSelectEvent={handleDiscoverySelect} />
    </div>
  );
}

export default App;
