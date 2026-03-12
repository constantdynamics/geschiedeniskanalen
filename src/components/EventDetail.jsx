import { CATEGORIES, REGIONS } from '../utils/constants';
import { formatYear } from '../utils/timeHelpers';

export default function EventDetail({ event, onClose, onGoToEvent }) {
  if (!event) return null;

  const category = CATEGORIES[event.category];
  const region = REGIONS[event.region];
  const isSingleYear = event.start === event.end;

  return (
    <div className="event-detail">
      <div className="event-detail-header">
        <h2>{event.title}</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="event-detail-meta">
        <span className="event-badge" style={{ backgroundColor: category?.color + '33', borderColor: category?.color }}>
          {category?.icon} {category?.label}
        </span>
        <span className="event-badge" style={{ backgroundColor: region?.color + '33', borderColor: region?.color }}>
          {region?.label}
        </span>
      </div>

      <div className="event-detail-dates">
        {isSingleYear
          ? formatYear(event.start)
          : `${formatYear(event.start)} — ${formatYear(event.end)}`
        }
      </div>

      <p className="event-detail-description">{event.description}</p>

      <button className="go-to-button" onClick={() => onGoToEvent(event)}>
        Zoom naar gebeurtenis
      </button>
    </div>
  );
}
