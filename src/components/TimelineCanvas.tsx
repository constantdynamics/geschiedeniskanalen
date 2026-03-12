import { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  HistoricalEvent,
  ZOOM_LEVELS,
  CATEGORY_CONFIG,
  REGION_CONFIG,
  ColorMode,
  formatYear,
} from '../types';
import {
  yearToX,
  getVisibleYearRange,
  getEventsInRange,
  assignSwimLanes,
} from '../utils/timeline';

interface TimelineCanvasProps {
  events: HistoricalEvent[];
  centerYear: number;
  zoom: number;
  colorMode: ColorMode;
  selectedEventId: string | null;
  isZooming: boolean;
  onEventClick: (eventId: string) => void;
  onEventHover: (event: HistoricalEvent | null, x: number, y: number) => void;
  width: number;
  height: number;
}

const BAR_HEIGHT = 28;
const BAR_GAP = 6;
const HEADER_HEIGHT = 50;
const LANE_OFFSET = HEADER_HEIGHT + 20;

export default function TimelineCanvas({
  events,
  centerYear,
  zoom,
  colorMode,
  selectedEventId,
  isZooming,
  onEventClick,
  onEventHover,
  width,
  height,
}: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitMapRef = useRef<Map<string, { x: number; y: number; w: number; h: number }>>(new Map());

  const zl = ZOOM_LEVELS[Math.min(zoom, ZOOM_LEVELS.length - 1)];

  const [startYear, endYear] = useMemo(
    () => getVisibleYearRange(centerYear, zoom, width),
    [centerYear, zoom, width]
  );

  const visibleEvents = useMemo(
    () => getEventsInRange(events, startYear, endYear),
    [events, startYear, endYear]
  );

  const swimLanes = useMemo(
    () => assignSwimLanes(visibleEvents, centerYear, zoom, width),
    [visibleEvents, centerYear, zoom, width]
  );

  const getColor = useCallback(
    (event: HistoricalEvent, alpha = 1): string => {
      const hex = colorMode === 'thema'
        ? CATEGORY_CONFIG[event.category].color
        : REGION_CONFIG[event.region].color;
      if (alpha === 1) return hex;
      // Convert hex to rgba
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    },
    [colorMode]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw time axis grid lines
    const tickInterval = zl.tickInterval;
    const firstTick = Math.ceil(startYear / tickInterval) * tickInterval;

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';

    for (let year = firstTick; year <= endYear; year += tickInterval) {
      const x = yearToX(year, centerYear, zoom, width);
      if (x < -10 || x > width + 10) continue;

      // Grid line
      ctx.beginPath();
      ctx.moveTo(x, HEADER_HEIGHT);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#64748b';
      ctx.fillText(formatYear(year), x, HEADER_HEIGHT - 8);
    }

    // Sub-ticks at half intervals
    const subTickInterval = tickInterval / 2;
    if (subTickInterval >= 1) {
      ctx.strokeStyle = '#111827';
      for (let year = Math.ceil(startYear / subTickInterval) * subTickInterval; year <= endYear; year += subTickInterval) {
        if (year % tickInterval === 0) continue;
        const x = yearToX(year, centerYear, zoom, width);
        if (x < -10 || x > width + 10) continue;
        ctx.beginPath();
        ctx.moveTo(x, HEADER_HEIGHT);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw header line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, HEADER_HEIGHT);
    ctx.lineTo(width, HEADER_HEIGHT);
    ctx.stroke();

    // Draw "now" indicator
    const nowX = yearToX(2024, centerYear, zoom, width);
    if (nowX >= 0 && nowX <= width) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(nowX, HEADER_HEIGHT);
      ctx.lineTo(nowX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px Inter, system-ui, sans-serif';
      ctx.fillText('NU', nowX, HEADER_HEIGHT - 24);
    }

    // Draw event bars
    const hitMap = new Map<string, { x: number; y: number; w: number; h: number }>();

    for (const event of visibleEvents) {
      const lane = swimLanes.get(event.id) ?? 0;
      const x1 = yearToX(event.start, centerYear, zoom, width);
      const eventEnd = event.start === event.end ? event.start + 1 : event.end;
      const x2 = yearToX(eventEnd, centerYear, zoom, width);
      const barWidth = Math.max(x2 - x1, 60);
      const y = LANE_OFFSET + lane * (BAR_HEIGHT + BAR_GAP);

      if (y > height) continue;

      const isSelected = event.id === selectedEventId;
      const color = getColor(event);
      const alpha = event.uncertaintyLevel === 'estimated' ? 0.6 : event.uncertaintyLevel === 'approximate' ? 0.8 : 1;

      // Bar shadow
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      // Bar background
      ctx.fillStyle = getColor(event, alpha * 0.85);
      ctx.beginPath();
      const radius = 6;
      ctx.roundRect(x1, y, barWidth, BAR_HEIGHT, radius);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Selected highlight
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x1, y, barWidth, BAR_HEIGHT, radius);
        ctx.stroke();
      }

      // Uncertainty indicator (dashed border)
      if (event.uncertaintyLevel !== 'exact') {
        ctx.strokeStyle = getColor(event, 0.5);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.roundRect(x1, y, barWidth, BAR_HEIGHT, radius);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Event text
      const textMaxWidth = barWidth - 8;
      if (textMaxWidth > 20) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${isSelected ? 'bold ' : ''}12px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'left';

        const icon = CATEGORY_CONFIG[event.category].icon;
        const displayText = `${icon} ${event.name}`;
        const measured = ctx.measureText(displayText);

        if (measured.width > textMaxWidth) {
          // Truncate
          let truncated = displayText;
          while (ctx.measureText(truncated + '...').width > textMaxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
          }
          ctx.fillText(truncated + '...', x1 + 4, y + BAR_HEIGHT / 2 + 4);
        } else {
          ctx.fillText(displayText, x1 + 4, y + BAR_HEIGHT / 2 + 4);
        }
      }

      hitMap.set(event.id, { x: x1, y, w: barWidth, h: BAR_HEIGHT });
    }

    hitMapRef.current = hitMap;

    // Zoom level indicator
    ctx.fillStyle = '#475569';
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Zoom: ${zl.label}`, width - 12, height - 12);
  }, [visibleEvents, swimLanes, centerYear, zoom, width, height, zl, getColor, selectedEventId, startYear, endYear]);

  useEffect(() => {
    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  const findEventAtPos = useCallback(
    (clientX: number, clientY: number): HistoricalEvent | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (const [eventId, bounds] of hitMapRef.current) {
        if (
          x >= bounds.x &&
          x <= bounds.x + bounds.w &&
          y >= bounds.y &&
          y <= bounds.y + bounds.h
        ) {
          return events.find((e) => e.id === eventId) || null;
        }
      }
      return null;
    },
    [events]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const event = findEventAtPos(e.clientX, e.clientY);
      if (event) {
        onEventClick(event.id);
      }
    },
    [findEventAtPos, onEventClick]
  );

  const handleMouseMoveCanvas = useCallback(
    (e: React.MouseEvent) => {
      const event = findEventAtPos(e.clientX, e.clientY);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = event ? 'pointer' : 'grab';
      }
      if (event) {
        onEventHover(event, e.clientX, e.clientY);
      } else {
        onEventHover(null, 0, 0);
      }
    },
    [findEventAtPos, onEventHover]
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      onClick={handleClick}
      onMouseMove={handleMouseMoveCanvas}
    />
  );
}
