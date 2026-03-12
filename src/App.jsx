import { useTimelineState } from './hooks/useTimelineState';
import Timeline from './components/Timeline';
import FilterPanel from './components/FilterPanel';
import EventDetail from './components/EventDetail';
import SearchBar from './components/SearchBar';
import events from './data/events';
import './App.css';

function App() {
  const state = useTimelineState();

  const handleGoToEvent = (event) => {
    const duration = event.end - event.start;
    const zoomYears = Math.max(duration * 3, 50);
    const center = event.start + duration / 2;
    state.goToYearAndZoom(center, zoomYears);
  };

  const handleSelectFromSearch = (event) => {
    state.setSelectedEvent(event);
    handleGoToEvent(event);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Geschiedeniskanalen</h1>
        <p className="subtitle">Interactieve tijdlijn van de wereldgeschiedenis</p>
        <SearchBar events={events} onSelectEvent={handleSelectFromSearch} />
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <FilterPanel
            colorMode={state.colorMode}
            selectedCategories={state.selectedCategories}
            selectedRegions={state.selectedRegions}
            onToggleCategory={state.toggleCategory}
            onToggleRegion={state.toggleRegion}
            onResetFilters={state.resetFilters}
            onToggleColorMode={state.toggleColorMode}
          />
        </aside>

        <main className="app-main">
          <Timeline
            events={events}
            centerYear={state.centerYear}
            yearsVisible={state.yearsVisible}
            colorMode={state.colorMode}
            selectedCategories={state.selectedCategories}
            selectedRegions={state.selectedRegions}
            selectedEvent={state.selectedEvent}
            onZoom={state.zoom}
            onPan={state.pan}
            onSelectEvent={state.setSelectedEvent}
          />
          <EventDetail
            event={state.selectedEvent}
            onClose={() => state.setSelectedEvent(null)}
            onGoToEvent={handleGoToEvent}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
