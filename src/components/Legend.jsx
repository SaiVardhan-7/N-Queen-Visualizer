import React from 'react';
import { Info } from 'lucide-react';

const items = [
  { color: 'bg-indigo-400', label: 'Trying', description: 'Evaluating this cell' },
  { color: 'bg-emerald-400', label: 'Placed', description: 'Queen placed successfully' },
  { color: 'bg-rose-400', label: 'Conflict', description: 'Cannot place here' },
  { color: 'bg-orange-400', label: 'Backtrack', description: 'Removing queen' },
  { color: 'bg-amber-400', label: 'Solution', description: 'Valid solution found!' },
];

export default function Legend() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 pb-1.5 border-b border-[var(--border-color)]">
        <Info size={14} className="text-[var(--text-muted)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Legend
        </span>
      </div>
      {items.map(({ color, label, description }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${color} shrink-0`} />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
          <span className="text-xs text-[var(--text-muted)] hidden xl:inline">— {description}</span>
        </div>
      ))}
    </div>
  );
}
