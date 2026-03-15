import { useState, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import type { HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '../types';
import WorldMap from './WorldMap';

interface StoryModeProps {
  events: HistoricalEvent[];
  startEventId?: string;
  onClose: () => void;
  onNavigateToEvent: (eventId: string) => void;
}

// Build a narrative chain: start from an event, follow relatedEvents and effects
function buildStoryChain(events: HistoricalEvent[], startId: string, maxLength = 8): HistoricalEvent[] {
  const eventMap = new Map(events.map((e) => [e.id, e]));
  const chain: HistoricalEvent[] = [];
  const visited = new Set<string>();

  const start = eventMap.get(startId);
  if (!start) return chain;

  // BFS-style: follow effects > relatedEvents, sorted by start year
  const queue = [start];
  while (queue.length > 0 && chain.length < maxLength) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    chain.push(current);

    // Add effects first, then related events, sorted by start year
    const next: HistoricalEvent[] = [];
    for (const id of [...(current.effects ?? []), ...current.relatedEvents]) {
      const ev = eventMap.get(id);
      if (ev && !visited.has(ev.id)) next.push(ev);
    }
    next.sort((a, b) => a.start - b.start);
    queue.push(...next.slice(0, 3));
  }

  return chain;
}

export default function StoryMode({ events, startEventId, onClose, onNavigateToEvent }: StoryModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick a default start: most popular event if none given
  const defaultStart = useMemo(() => {
    if (startEventId) return startEventId;
    return [...events].sort((a, b) => b.popularityScore - a.popularityScore)[0]?.id;
  }, [events, startEventId]);

  const chain = useMemo(
    () => buildStoryChain(events, defaultStart ?? ''),
    [events, defaultStart]
  );

  if (chain.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]">
        <div className="bg-surface-light border border-border rounded-xl p-6 text-text-secondary">
          Geen verhaallijn beschikbaar voor dit event.
          <button onClick={onClose} className="ml-3 text-blue-400 hover:underline">Sluiten</button>
        </div>
      </div>
    );
  }

  const current = chain[currentIndex];
  const cat = CATEGORY_CONFIG[current.category];
  const reg = REGION_CONFIG[current.region];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-surface-light border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface-light">
          <BookOpen size={16} className="text-purple-400 shrink-0" />
          <span className="text-sm font-semibold text-text-primary flex-1">Verhaallijn-modus</span>
          <span className="text-xs text-text-secondary">
            {currentIndex + 1} / {chain.length}
          </span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-lighter text-text-secondary hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / chain.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Event emoji + name */}
          <div className="flex items-start gap-3">
            <div className="text-4xl">{current.image}</div>
            <div>
              <h2 className="text-xl font-bold text-text-primary leading-tight">{current.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                  {cat.icon} {cat.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: reg.color + '20', color: reg.color }}>
                  {reg.label}
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {formatYear(current.start)}{current.start !== current.end ? ` — ${formatYear(current.end)}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Map */}
          <WorldMap region={current.region} size="sm" />

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed">{current.description}</p>

          {/* Fun fact highlight */}
          {current.funFacts[0] && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-3 py-2">
              <div className="text-xs text-yellow-400 font-semibold mb-0.5">💡 Wist je dat...</div>
              <p className="text-xs text-text-secondary">{current.funFacts[0]}</p>
            </div>
          )}

          {/* Chain overview */}
          <div>
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">Verhaallijn</div>
            <div className="flex gap-1.5 flex-wrap">
              {chain.map((ev, i) => (
                <button
                  key={ev.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border ${
                    i === currentIndex
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : i < currentIndex
                      ? 'bg-surface border-border text-text-secondary line-through opacity-60'
                      : 'bg-surface border-border text-text-secondary hover:border-blue-500/50 hover:text-blue-400'
                  }`}
                >
                  <span>{ev.image}</span>
                  <span className="hidden sm:inline truncate max-w-16">{ev.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-surface-lighter border border-border text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <ChevronLeft size={14} />
            Vorige
          </button>

          <button
            onClick={() => {
              onNavigateToEvent(current.id);
              onClose();
            }}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Op tijdlijn bekijken
          </button>

          <button
            onClick={() => setCurrentIndex((i) => Math.min(chain.length - 1, i + 1))}
            disabled={currentIndex === chain.length - 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Volgende
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
