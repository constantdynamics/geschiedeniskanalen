import { ZoomIn, ZoomOut, Compass, Shuffle } from 'lucide-react';
import { ZOOM_LEVELS, formatYear } from '../types';

interface ToolbarProps {
  centerYear: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNavigateToYear: (year: number, zoom?: number) => void;
  onRandomEvent: () => void;
}

const QUICK_NAV = [
  { label: 'Oudheid', year: -1500, zoom: 1 },
  { label: 'Middeleeuwen', year: 1000, zoom: 2 },
  { label: 'Renaissance', year: 1500, zoom: 3 },
  { label: '1800s', year: 1850, zoom: 4 },
  { label: '1900s', year: 1950, zoom: 4 },
  { label: 'Nu', year: 2020, zoom: 5 },
];

export default function Toolbar({
  centerYear,
  zoom,
  onZoomIn,
  onZoomOut,
  onNavigateToYear,
  onRandomEvent,
}: ToolbarProps) {
  const zl = ZOOM_LEVELS[Math.min(zoom, ZOOM_LEVELS.length - 1)];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Current position */}
      <div className="text-sm text-text-secondary mr-2">
        <span className="text-text-primary font-medium">{formatYear(Math.round(centerYear))}</span>
        <span className="mx-1 text-border">|</span>
        <span>{zl.label}</span>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 bg-surface-light rounded-lg border border-border p-0.5">
        <button
          onClick={onZoomOut}
          disabled={zoom === 0}
          className="p-1.5 rounded-md hover:bg-surface-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-primary"
          title="Uitzoomen"
        >
          <ZoomOut size={14} />
        </button>
        <div className="w-16 h-1.5 bg-surface rounded-full relative mx-1">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(zoom / (ZOOM_LEVELS.length - 1)) * 100}%` }}
          />
        </div>
        <button
          onClick={onZoomIn}
          disabled={zoom === ZOOM_LEVELS.length - 1}
          className="p-1.5 rounded-md hover:bg-surface-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-primary"
          title="Inzoomen"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      {/* Quick nav */}
      <div className="flex items-center gap-1 ml-2">
        <Compass size={14} className="text-text-secondary" />
        {QUICK_NAV.map((nav) => (
          <button
            key={nav.label}
            onClick={() => onNavigateToYear(nav.year, nav.zoom)}
            className="px-2 py-1 text-xs rounded-md bg-surface-light hover:bg-surface-lighter border border-border text-text-secondary hover:text-text-primary transition-colors"
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* Random / Discover */}
      <button
        onClick={onRandomEvent}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-xs text-white font-medium transition-all ml-auto"
        title="Ontdek een willekeurig event"
      >
        <Shuffle size={14} />
        Ontdek!
      </button>
    </div>
  );
}
