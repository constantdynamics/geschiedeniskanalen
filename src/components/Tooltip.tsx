import type { HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '../types';

interface TooltipProps {
  event: HistoricalEvent;
  x: number;
  y: number;
}

export default function Tooltip({ event, x, y }: TooltipProps) {
  const cat = CATEGORY_CONFIG[event.category];
  const reg = REGION_CONFIG[event.region];

  // Position tooltip to avoid going off-screen
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(x + 12, window.innerWidth - 320),
    top: Math.min(y - 10, window.innerHeight - 160),
    zIndex: 1000,
    pointerEvents: 'none',
  };

  const duration = event.start === event.end
    ? formatYear(event.start)
    : `${formatYear(event.start)} - ${formatYear(event.end)}`;

  return (
    <div style={tooltipStyle} className="bg-surface-light border border-border rounded-lg p-3 shadow-xl max-w-[300px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{event.image}</span>
        <span className="font-semibold text-text-primary text-sm">{event.name}</span>
      </div>
      <div className="text-xs text-text-secondary mb-1">{duration}</div>
      <div className="flex gap-2 mb-2">
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ backgroundColor: cat.color + '30', color: cat.color }}
        >
          {cat.icon} {cat.label}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ backgroundColor: reg.color + '30', color: reg.color }}
        >
          {reg.label}
        </span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{event.description}</p>
      {event.uncertaintyLevel !== 'exact' && (
        <div className="mt-1 text-xs text-amber-400 italic">
          Datering: {event.uncertaintyLevel === 'approximate' ? 'bij benadering' : 'geschat'}
        </div>
      )}
    </div>
  );
}
