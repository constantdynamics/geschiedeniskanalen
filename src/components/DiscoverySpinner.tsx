import { useState, useCallback, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, formatYear } from '../types';
import { getRandomPopularEvent } from '../utils/timeline';

interface DiscoverySpinnerProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
}

export default function DiscoverySpinner({ events, onSelectEvent }: DiscoverySpinnerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<HistoricalEvent | null>(null);
  const [displayedEvents, setDisplayedEvents] = useState<HistoricalEvent[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Animate through random events
    let count = 0;
    const maxCount = 20;
    const finalEvent = getRandomPopularEvent(events);

    intervalRef.current = setInterval(() => {
      count++;
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setDisplayedEvents((prev) => [...prev.slice(-4), randomEvent]);

      if (count >= maxCount) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayedEvents((prev) => [...prev.slice(-4), finalEvent]);
        setResult(finalEvent);
        setIsSpinning(false);
      }
    }, 80 + count * 10); // Gradually slows down
  }, [events, isSpinning]);

  const close = () => {
    setIsOpen(false);
    setResult(null);
    setDisplayedEvents([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full shadow-lg shadow-purple-900/50 flex items-center justify-center transition-all hover:scale-110 z-40"
        title="Ontdek een willekeurig historisch event!"
      >
        <Sparkles size={24} className="text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-light border border-border rounded-2xl p-6 w-[400px] max-w-[90vw] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-text-primary">Ontdek Geschiedenis</h3>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg hover:bg-surface-lighter text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Spinner display */}
        <div className="bg-surface rounded-xl border border-border p-4 mb-4 min-h-[200px] flex flex-col items-center justify-center">
          {!isSpinning && !result && (
            <div className="text-center">
              <div className="text-4xl mb-3">🎰</div>
              <p className="text-sm text-text-secondary">
                Druk op de knop om een willekeurige historische gebeurtenis te ontdekken!
              </p>
            </div>
          )}

          {isSpinning && displayedEvents.length > 0 && (
            <div className="w-full space-y-1 overflow-hidden">
              {displayedEvents.slice(-5).map((event, i) => {
                const isLast = i === displayedEvents.slice(-5).length - 1;
                return (
                  <div
                    key={`${event.id}-${i}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                    style={{
                      opacity: isLast ? 1 : 0.3,
                      transform: `scale(${isLast ? 1 : 0.95})`,
                      backgroundColor: isLast ? CATEGORY_CONFIG[event.category].color + '20' : 'transparent',
                    }}
                  >
                    <span className="text-xl">{event.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">{event.name}</div>
                      <div className="text-xs text-text-secondary">{formatYear(event.start)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {result && !isSpinning && (
            <div className="text-center w-full">
              <div className="text-4xl mb-3">{result.image}</div>
              <h4 className="text-lg font-bold text-text-primary mb-1">{result.name}</h4>
              <div className="text-sm text-text-secondary mb-2">
                {result.start === result.end ? formatYear(result.start) : `${formatYear(result.start)} — ${formatYear(result.end)}`}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">{result.description}</p>
              {result.funFacts[0] && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-200">
                  💡 {result.funFacts[0]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={spin}
            disabled={isSpinning}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-xl text-white font-semibold transition-all"
          >
            {isSpinning ? 'Aan het draaien...' : result ? 'Nog een keer!' : 'Draai!'}
          </button>
          {result && (
            <button
              onClick={() => {
                onSelectEvent(result);
                close();
              }}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all"
            >
              Bekijk op tijdlijn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
