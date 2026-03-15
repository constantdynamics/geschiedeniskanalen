import { useEffect, useRef } from 'react';
import { Eye, ExternalLink, Shuffle, X } from 'lucide-react';
import type { HistoricalEvent } from '../types';
import { CATEGORY_CONFIG, formatYear } from '../types';

interface ContextMenuProps {
  event: HistoricalEvent;
  x: number;
  y: number;
  onClose: () => void;
  onViewDetail: () => void;
  onOpenWikipedia: () => void;
  onRandomEvent: () => void;
}

export default function ContextMenu({ event, x, y, onClose, onViewDetail, onOpenWikipedia, onRandomEvent }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const cat = CATEGORY_CONFIG[event.category];

  // Adjust position to keep menu on screen
  const menuX = Math.min(x, window.innerWidth - 200);
  const menuY = Math.min(y, window.innerHeight - 200);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-surface-light border border-border rounded-xl shadow-2xl overflow-hidden z-[10000] w-52"
      style={{ left: menuX, top: menuY }}
    >
      {/* Event header */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <span className="text-lg">{event.image}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-text-primary truncate">{event.name}</div>
          <div className="text-xs text-text-secondary" style={{ color: cat.color }}>
            {cat.icon} {formatYear(event.start)}{event.start !== event.end ? ` — ${formatYear(event.end)}` : ''}
          </div>
        </div>
        <button onClick={onClose} className="text-text-secondary hover:text-text-primary shrink-0">
          <X size={12} />
        </button>
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={onViewDetail}
          className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-surface-lighter transition-colors text-sm text-text-primary"
        >
          <Eye size={14} className="text-blue-400 shrink-0" />
          Bekijk details
        </button>
        <button
          onClick={onOpenWikipedia}
          className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-surface-lighter transition-colors text-sm text-text-primary"
        >
          <ExternalLink size={14} className="text-emerald-400 shrink-0" />
          Open Wikipedia
        </button>
        <div className="h-px bg-border mx-2 my-1" />
        <button
          onClick={onRandomEvent}
          className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-surface-lighter transition-colors text-sm text-text-primary"
        >
          <Shuffle size={14} className="text-purple-400 shrink-0" />
          Willekeurig event
        </button>
      </div>
    </div>
  );
}
