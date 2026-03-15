import { useCallback } from 'react';
import { formatYear } from '../types';
import { MIN_YEAR, MAX_YEAR } from '../utils/timeline';

interface YearRangeFilterProps {
  value?: [number, number];
  onChange: (range: [number, number] | undefined) => void;
}

export default function YearRangeFilter({ value, onChange }: YearRangeFilterProps) {
  const start = value?.[0] ?? MIN_YEAR;
  const end = value?.[1] ?? MAX_YEAR;
  const isActive = value !== undefined;

  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStart = Math.min(Number(e.target.value), end - 1);
      onChange([newStart, end]);
    },
    [end, onChange]
  );

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEnd = Math.max(Number(e.target.value), start + 1);
      onChange([start, newEnd]);
    },
    [start, onChange]
  );

  const toggle = () => {
    if (isActive) {
      onChange(undefined);
    } else {
      onChange([MIN_YEAR, MAX_YEAR]);
    }
  };

  const startPct = ((start - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const endPct = ((end - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary uppercase tracking-wider">Tijdsperiode</span>
        <button
          onClick={toggle}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            isActive
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
              : 'bg-surface text-text-secondary border-border hover:border-blue-500/50 hover:text-blue-400'
          }`}
        >
          {isActive ? 'aan' : 'uit'}
        </button>
      </div>

      {isActive && (
        <>
          {/* Year labels */}
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span className="font-mono">{formatYear(start)}</span>
            <span className="font-mono">{formatYear(end)}</span>
          </div>

          {/* Dual range slider */}
          <div className="relative h-6 flex items-center">
            {/* Track background */}
            <div className="absolute inset-x-0 h-1.5 bg-surface rounded-full" />
            {/* Active range fill */}
            <div
              className="absolute h-1.5 bg-blue-500 rounded-full"
              style={{ left: `${startPct}%`, right: `${100 - endPct}%` }}
            />
            {/* Start handle */}
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={start}
              onChange={handleStartChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: start > end - (MAX_YEAR - MIN_YEAR) * 0.1 ? 5 : 3 }}
            />
            {/* End handle */}
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={end}
              onChange={handleEndChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 4 }}
            />
            {/* Visual handles */}
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{ left: `calc(${startPct}% - 8px)`, zIndex: 6 }}
            />
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{ left: `calc(${endPct}% - 8px)`, zIndex: 6 }}
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1 mt-2">
            {[
              { label: 'Oudheid', range: [-3000, 500] as [number, number] },
              { label: 'Middeleeuwen', range: [500, 1500] as [number, number] },
              { label: 'Modern', range: [1500, 1900] as [number, number] },
              { label: '20e eeuw', range: [1900, 2000] as [number, number] },
              { label: 'Heden', range: [2000, 2024] as [number, number] },
            ].map(({ label, range }) => (
              <button
                key={label}
                onClick={() => onChange(range)}
                className="px-2 py-0.5 text-[10px] rounded-full bg-surface text-text-secondary border border-border hover:border-blue-500/50 hover:text-blue-400 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
