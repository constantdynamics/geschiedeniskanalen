import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import type { FilterState, Category, Region } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const ALL_REGIONS = Object.keys(REGION_CONFIG) as Region[];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (cat: Category) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: cats });
  };

  const toggleRegion = (reg: Region) => {
    const regs = filters.regions.includes(reg)
      ? filters.regions.filter((r) => r !== reg)
      : [...filters.regions, reg];
    onChange({ ...filters, regions: regs });
  };

  const toggleColorMode = () => {
    onChange({ ...filters, colorMode: filters.colorMode === 'thema' ? 'geo' : 'thema' });
  };

  const setSearch = (q: string) => {
    onChange({ ...filters, searchQuery: q });
  };

  const clearAll = () => {
    onChange({ categories: [], regions: [], colorMode: filters.colorMode, searchQuery: '' });
  };

  const activeCount = filters.categories.length + filters.regions.length + (filters.searchQuery ? 1 : 0);

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface-light hover:bg-surface-lighter rounded-lg text-sm text-text-primary transition-colors border border-border"
      >
        <Filter size={14} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-surface-light border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Zoek event..."
                value={filters.searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-surface text-text-primary text-sm rounded-lg border border-border focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Color mode toggle */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary uppercase tracking-wider">Kleurmodus</span>
              <button
                onClick={toggleColorMode}
                className="flex items-center gap-2 px-3 py-1 bg-surface rounded-full text-xs transition-colors"
              >
                <span className={filters.colorMode === 'thema' ? 'text-blue-400 font-semibold' : 'text-text-secondary'}>
                  Thema
                </span>
                <span className="text-text-secondary">/</span>
                <span className={filters.colorMode === 'geo' ? 'text-blue-400 font-semibold' : 'text-text-secondary'}>
                  Regio
                </span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="p-3 border-b border-border">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Categorieën</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const active = filters.categories.length === 0 || filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="px-2 py-1 rounded-md text-xs transition-all"
                    style={{
                      backgroundColor: active ? cfg.color + '25' : '#1e293b',
                      color: active ? cfg.color : '#64748b',
                      border: `1px solid ${active ? cfg.color + '50' : '#334155'}`,
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regions */}
          <div className="p-3 border-b border-border">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Regio's</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_REGIONS.map((reg) => {
                const cfg = REGION_CONFIG[reg];
                const active = filters.regions.length === 0 || filters.regions.includes(reg);
                return (
                  <button
                    key={reg}
                    onClick={() => toggleRegion(reg)}
                    className="px-2 py-1 rounded-md text-xs transition-all"
                    style={{
                      backgroundColor: active ? cfg.color + '25' : '#1e293b',
                      color: active ? cfg.color : '#64748b',
                      border: `1px solid ${active ? cfg.color + '50' : '#334155'}`,
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear */}
          {activeCount > 0 && (
            <div className="p-3">
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Wis alle filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
