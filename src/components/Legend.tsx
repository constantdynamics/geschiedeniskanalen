import type { ColorMode } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG } from '../types';

interface LegendProps {
  colorMode: ColorMode;
}

export default function Legend({ colorMode }: LegendProps) {
  const items = colorMode === 'thema'
    ? Object.entries(CATEGORY_CONFIG).map(([, cfg]) => ({
        label: cfg.label,
        color: cfg.color,
        icon: cfg.icon,
      }))
    : Object.entries(REGION_CONFIG).map(([, cfg]) => ({
        label: cfg.label,
        color: cfg.color,
        icon: '',
      }));

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface-light/50 border-t border-border overflow-x-auto">
      <span className="text-xs text-text-secondary whitespace-nowrap">
        {colorMode === 'thema' ? 'Thema:' : 'Regio:'}
      </span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 whitespace-nowrap">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-text-secondary">
            {item.icon ? `${item.icon} ` : ''}{item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
