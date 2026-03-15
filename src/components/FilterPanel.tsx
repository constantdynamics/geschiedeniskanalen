import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, Filter, Search, BarChart3, Info } from 'lucide-react';
import type { FilterState, Category, Region, HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG } from '../types';
import { APP_VERSION } from '../version';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  events: HistoricalEvent[];
  filteredCount: number;
  focusTrigger?: number;
}

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const ALL_REGIONS = Object.keys(REGION_CONFIG) as Region[];

export default function FilterPanel({ filters, onChange, events, filteredCount, focusTrigger }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Position the dropdown below the button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isOpen]);

  // Focus search when triggered externally (keyboard shortcut /)
  useEffect(() => {
    if (!focusTrigger) return;
    setIsOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [focusTrigger]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

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

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) counts[cat] = 0;
    for (const ev of events) counts[ev.category]++;
    return counts;
  }, [events]);

  const activeCount = filters.categories.length + filters.regions.length + (filters.searchQuery ? 1 : 0);

  return (
    <>
      {/* Toggle button */}
      <button
        ref={buttonRef}
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

      {/* Portal dropdown - renders outside overflow-hidden parent */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-80 bg-surface-light border border-border rounded-xl shadow-2xl overflow-y-auto"
            style={{ top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999, maxHeight: 'calc(100vh - 80px)' }}
          >
            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  ref={searchInputRef}
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
              <div className="px-3 pt-3 pb-0">
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Wis alle filters
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 size={12} className="text-text-secondary" />
                <span className="text-xs text-text-secondary uppercase tracking-wider">Statistieken</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <div className="bg-surface rounded-lg px-2.5 py-1.5 text-center">
                  <div className="text-lg font-bold text-blue-400">{events.length}</div>
                  <div className="text-[10px] text-text-secondary">Totaal</div>
                </div>
                <div className="bg-surface rounded-lg px-2.5 py-1.5 text-center">
                  <div className="text-lg font-bold text-emerald-400">{filteredCount}</div>
                  <div className="text-[10px] text-text-secondary">Gefilterd</div>
                </div>
              </div>
              <div className="space-y-1">
                {ALL_CATEGORIES.map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const count = categoryStats[cat];
                  const pct = events.length > 0 ? (count / events.length) * 100 : 0;
                  return (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-center">{cfg.icon}</span>
                      <span className="flex-1 text-text-secondary truncate">{cfg.label}</span>
                      <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                      </div>
                      <span className="text-text-secondary w-6 text-right tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Version */}
            <div className="px-3 py-2 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info size={10} className="text-text-secondary" />
                <span className="text-[10px] text-text-secondary">Tijdlijn v{APP_VERSION}</span>
              </div>
              <span className="text-[10px] text-text-secondary">{events.length} events</span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
