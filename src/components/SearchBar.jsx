import { useState, useMemo } from 'react';

export default function SearchBar({ events, onSelectEvent }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return events
      .filter(e => e.title.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, events]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Zoek gebeurtenis..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(event => (
            <button
              key={event.id}
              className="search-result"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectEvent(event);
                setQuery('');
                setIsOpen(false);
              }}
            >
              {event.title}
              <span className="search-result-year">
                {event.start < 0 ? `${Math.abs(event.start)} v.Chr.` : event.start}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
