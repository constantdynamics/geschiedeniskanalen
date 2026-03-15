import type { Region } from '../types';
import { REGION_CONFIG } from '../types';

interface WorldMapProps {
  region: Region;
  extraRegions?: Region[];
  size?: 'sm' | 'md';
}

// Simplified world map using rough SVG paths for each region
// Coordinates are on a 0-0 to 360-180 grid (lon+180, lat_inverted)
const REGION_PATHS: Partial<Record<Region, string>> = {
  europa: 'M165,30 L200,28 L210,45 L195,60 L175,58 L160,50 Z',
  azie: 'M210,25 L290,20 L300,70 L270,80 L230,75 L215,55 Z',
  afrika: 'M165,60 L210,58 L215,110 L190,130 L165,120 L155,85 Z',
  amerika: 'M60,20 L110,18 L115,80 L95,110 L70,95 L55,55 Z',
  oceanie: 'M270,100 L315,95 L320,130 L285,135 L265,120 Z',
  'midden-oosten': 'M205,55 L230,52 L235,75 L215,80 L200,70 Z',
  'centraal-azie': 'M230,35 L265,30 L270,55 L245,60 L225,55 Z',
  'zuidoost-azie': 'M265,65 L300,60 L305,90 L275,95 L260,82 Z',
  'latijns-amerika': 'M80,80 L115,75 L118,140 L90,145 L72,120 Z',
  caraiben: 'M100,60 L120,58 L122,72 L102,73 Z',
  'noord-afrika': 'M160,55 L215,52 L218,80 L165,82 Z',
};

// Fallback bounding boxes for simple rect drawing
const REGION_RECTS: Partial<Record<Region, [number, number, number, number]>> = {
  europa: [155, 28, 60, 35],
  azie: [205, 20, 100, 65],
  afrika: [150, 58, 70, 80],
  amerika: [50, 15, 70, 110],
  oceanie: [258, 90, 70, 50],
  'midden-oosten': [196, 50, 42, 32],
  'centraal-azie': [226, 28, 48, 32],
  'zuidoost-azie': [256, 58, 50, 40],
  'latijns-amerika': [65, 75, 60, 75],
  caraiben: [96, 55, 28, 18],
  'noord-afrika': [155, 50, 65, 34],
};

export default function WorldMap({ region, extraRegions = [], size = 'md' }: WorldMapProps) {
  const w = size === 'sm' ? 180 : 260;
  const h = size === 'sm' ? 100 : 140;
  const scaleX = w / 360;
  const scaleY = h / 180;

  const activeRegions = [region, ...extraRegions];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="rounded-lg border border-border overflow-hidden"
      style={{ background: '#0f172a' }}
    >
      {/* Ocean background */}
      <rect width={w} height={h} fill="#1e293b" rx="6" />

      {/* Draw all known regions as light grey */}
      {(Object.keys(REGION_RECTS) as Region[]).map((reg) => {
        const rect = REGION_RECTS[reg];
        if (!rect) return null;
        const [rx, ry, rw, rh] = rect;
        const isActive = activeRegions.includes(reg);
        const cfg = REGION_CONFIG[reg];
        return (
          <rect
            key={reg}
            x={rx * scaleX}
            y={ry * scaleY}
            width={rw * scaleX}
            height={rh * scaleY}
            rx="2"
            fill={isActive ? cfg.color : '#334155'}
            opacity={isActive ? 0.85 : 0.4}
            stroke={isActive ? cfg.color : 'transparent'}
            strokeWidth={isActive ? 1 : 0}
          />
        );
      })}

      {/* Label for active region */}
      {REGION_RECTS[region] && (() => {
        const [rx, ry, rw, rh] = REGION_RECTS[region]!;
        const cx = (rx + rw / 2) * scaleX;
        const cy = (ry + rh / 2) * scaleY;
        const cfg = REGION_CONFIG[region];
        return (
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontSize={size === 'sm' ? 6 : 8}
            fill={cfg.color}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="600"
          >
            {cfg.label}
          </text>
        );
      })()}
    </svg>
  );
}
