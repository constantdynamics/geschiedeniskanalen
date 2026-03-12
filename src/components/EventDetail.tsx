import { X, ExternalLink, Lightbulb, HelpCircle, Link2 } from 'lucide-react';
import type { HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '../types';

interface EventDetailProps {
  event: HistoricalEvent;
  allEvents: HistoricalEvent[];
  onClose: () => void;
  onNavigateToEvent: (eventId: string) => void;
}

export default function EventDetail({ event, allEvents, onClose, onNavigateToEvent }: EventDetailProps) {
  const cat = CATEGORY_CONFIG[event.category];
  const reg = REGION_CONFIG[event.region];

  const duration = event.start === event.end
    ? formatYear(event.start)
    : `${formatYear(event.start)} — ${formatYear(event.end)}`;

  const durationYears = event.end - event.start;

  const relatedEvents = event.relatedEvents
    .map((id) => allEvents.find((e) => e.id === id))
    .filter(Boolean) as HistoricalEvent[];

  // Find contemporaneous events (overlapping in time, different event)
  const contemporaneous = allEvents
    .filter((e) => e.id !== event.id && e.start <= event.end && e.end >= event.start)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 5);

  return (
    <div className="w-96 bg-surface-light border-l border-border h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-surface-light z-10 border-b border-border">
        <div className="flex items-start justify-between p-4">
          <div className="flex-1">
            <div className="text-3xl mb-2">{event.image}</div>
            <h2 className="text-lg font-bold text-text-primary leading-tight">{event.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-lighter text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Meta badges */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          <span
            className="text-xs px-2 py-1 rounded-md font-medium"
            style={{ backgroundColor: cat.color + '20', color: cat.color }}
          >
            {cat.icon} {cat.label}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-md font-medium"
            style={{ backgroundColor: reg.color + '20', color: reg.color }}
          >
            {reg.label}
          </span>
          {event.uncertaintyLevel !== 'exact' && (
            <span className="text-xs px-2 py-1 rounded-md bg-amber-500/20 text-amber-400">
              {event.uncertaintyLevel === 'approximate' ? 'Bij benadering' : 'Geschatte datering'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-5">
        {/* Duration */}
        <div>
          <div className="text-sm font-semibold text-text-primary mb-1">{duration}</div>
          {durationYears > 0 && (
            <div className="text-xs text-text-secondary">{durationYears} jaar</div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>

        {/* Fun Facts */}
        {event.funFacts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Wist je dat...</span>
            </div>
            <div className="space-y-2">
              {event.funFacts.map((fact, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-lg p-3 text-sm text-text-secondary leading-relaxed border border-border"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teaser question */}
        {event.teaserQuestion && (
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-500/30">
            <div className="flex items-center gap-1.5 mb-1">
              <HelpCircle size={14} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Denkprikkel</span>
            </div>
            <p className="text-sm text-purple-200">{event.teaserQuestion}</p>
          </div>
        )}

        {/* Contemporaneous events */}
        {contemporaneous.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Link2 size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Tegelijkertijd</span>
            </div>
            <div className="space-y-1">
              {contemporaneous.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onNavigateToEvent(e.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-surface hover:bg-surface-lighter border border-border transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span>{e.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-text-primary truncate group-hover:text-blue-400 transition-colors">
                        {e.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {formatYear(e.start)}{e.start !== e.end ? ` — ${formatYear(e.end)}` : ''}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Gerelateerd</div>
            <div className="space-y-1">
              {relatedEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onNavigateToEvent(e.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-surface hover:bg-surface-lighter border border-border transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span>{e.image}</span>
                    <span className="text-xs font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                      {e.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wikipedia link */}
        {event.wikipediaUrl && (
          <a
            href={event.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink size={14} />
            Lees meer op Wikipedia
          </a>
        )}
      </div>

      {/* Popularity score */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Populariteit</span>
          <span>{event.popularityScore}/100</span>
        </div>
        <div className="mt-1 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${event.popularityScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
