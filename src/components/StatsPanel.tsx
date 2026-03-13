import { useMemo } from 'react';
import { BarChart3, Globe, Hash } from 'lucide-react';
import type { HistoricalEvent, Category, Region } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG } from '../types';
import { APP_VERSION } from '../version';

interface StatsPanelProps {
  allEvents: HistoricalEvent[];
  filteredEvents: HistoricalEvent[];
  onFilterCategory: (cat: Category) => void;
  onFilterRegion: (reg: Region) => void;
}

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];
const ALL_REGIONS = Object.keys(REGION_CONFIG) as Region[];

export default function StatsPanel({ allEvents, filteredEvents, onFilterCategory, onFilterRegion }: StatsPanelProps) {
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) counts[cat] = 0;
    for (const ev of filteredEvents) counts[ev.category]++;
    return counts;
  }, [filteredEvents]);

  const regionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const reg of ALL_REGIONS) counts[reg] = 0;
    for (const ev of filteredEvents) counts[ev.region]++;
    return counts;
  }, [filteredEvents]);

  const maxCatCount = Math.max(...Object.values(categoryStats), 1);
  const maxRegCount = Math.max(...Object.values(regionStats), 1);

  return (
    <div className="w-56 bg-surface-light border-r border-border h-full overflow-y-auto flex flex-col shrink-0">
      {/* Total counts */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-1.5 mb-2">
          <Hash size={12} className="text-blue-400" />
          <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Overzicht</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface rounded-lg px-2 py-2 text-center">
            <div className="text-xl font-bold text-blue-400">{allEvents.length}</div>
            <div className="text-[10px] text-text-secondary">Totaal</div>
          </div>
          <div className="bg-surface rounded-lg px-2 py-2 text-center">
            <div className="text-xl font-bold text-emerald-400">{filteredEvents.length}</div>
            <div className="text-[10px] text-text-secondary">Zichtbaar</div>
          </div>
        </div>
      </div>

      {/* Category stats */}
      <div className="p-3 border-b border-border flex-1">
        <div className="flex items-center gap-1.5 mb-3">
          <BarChart3 size={12} className="text-purple-400" />
          <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Per thema</span>
        </div>
        <div className="space-y-2">
          {ALL_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const count = categoryStats[cat];
            const pct = (count / maxCatCount) * 100;
            return (
              <button
                key={cat}
                onClick={() => onFilterCategory(cat)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs">{cfg.icon}</span>
                  <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors flex-1 truncate">
                    {cfg.label}
                  </span>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: cfg.color }}>
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region stats */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-1.5 mb-3">
          <Globe size={12} className="text-cyan-400" />
          <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Per regio</span>
        </div>
        <div className="space-y-2">
          {ALL_REGIONS.map((reg) => {
            const cfg = REGION_CONFIG[reg];
            const count = regionStats[reg];
            const pct = (count / maxRegCount) * 100;
            return (
              <button
                key={reg}
                onClick={() => onFilterRegion(reg)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors flex-1">
                    {cfg.label}
                  </span>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: cfg.color }}>
                    {count}
                  </span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Version footer */}
      <div className="px-3 py-2 mt-auto">
        <span className="text-[10px] text-text-secondary/50">v{APP_VERSION}</span>
      </div>
    </div>
  );
}
