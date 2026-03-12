import { CATEGORIES, REGIONS, COLOR_MODES } from '../utils/constants';

export default function FilterPanel({
  colorMode,
  selectedCategories,
  selectedRegions,
  onToggleCategory,
  onToggleRegion,
  onResetFilters,
  onToggleColorMode,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-section">
        <div className="filter-header">
          <h3>Kleurmodus</h3>
        </div>
        <button
          className="color-mode-toggle"
          onClick={onToggleColorMode}
        >
          {colorMode === COLOR_MODES.CATEGORY ? '🏷️ Categorie' : '🌍 Regio'}
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Categorieën</h3>
        </div>
        <div className="filter-chips">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const active = selectedCategories === null || selectedCategories.has(key);
            return (
              <button
                key={key}
                className={`filter-chip ${active ? 'active' : ''}`}
                style={{
                  borderColor: cat.color,
                  backgroundColor: active ? cat.color + '33' : 'transparent',
                }}
                onClick={() => onToggleCategory(key)}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Regio's</h3>
        </div>
        <div className="filter-chips">
          {Object.entries(REGIONS).map(([key, region]) => {
            const active = selectedRegions === null || selectedRegions.has(key);
            return (
              <button
                key={key}
                className={`filter-chip ${active ? 'active' : ''}`}
                style={{
                  borderColor: region.color,
                  backgroundColor: active ? region.color + '33' : 'transparent',
                }}
                onClick={() => onToggleRegion(key)}
              >
                {region.label}
              </button>
            );
          })}
        </div>
      </div>

      {(selectedCategories !== null || selectedRegions !== null) && (
        <button className="reset-button" onClick={onResetFilters}>
          Filters wissen
        </button>
      )}
    </div>
  );
}
