import React from 'react';
import { Trophy, Footprints, Grid3X3, Target } from 'lucide-react';

export default function StatsBar({ step, currentStepIndex, totalSteps, n }) {
  if (!step) return null;

  const { type, row, col, queens, solutionNumber } = step;

  // Count solutions found so far
  const solutionsFound = solutionNumber || 0;

  const typeLabels = {
    TRYING: { text: 'Trying', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    CONFLICT: { text: 'Conflict', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    PLACED: { text: 'Placed', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    BACKTRACK: { text: 'Backtrack', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    SOLUTION: { text: 'Solution!', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  };

  const label = typeLabels[type] || typeLabels.TRYING;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Current action */}
      <div className={`stat-fade flex items-center gap-2 px-3 py-1.5 rounded-lg ${label.bg} border border-[var(--border-color)]`}>
        <Target size={14} className={label.color} />
        <span className={`text-xs font-semibold ${label.color}`}>{label.text}</span>
        {type !== 'SOLUTION' && (
          <span className="text-xs font-mono text-[var(--text-muted)]">
            ({row}, {col})
          </span>
        )}
      </div>

      {/* Step counter */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Footprints size={14} className="text-[var(--accent-cyan)]" />
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          Step <span className="text-[var(--text-primary)] font-semibold">{currentStepIndex}</span>
          <span className="text-[var(--text-muted)]"> / {totalSteps - 1}</span>
        </span>
      </div>

      {/* Queens placed */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Grid3X3 size={14} className="text-[var(--accent-purple)]" />
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          Queens <span className="text-[var(--text-primary)] font-semibold">{queens.length}</span>
          <span className="text-[var(--text-muted)]"> / {n}</span>
        </span>
      </div>

      {/* Solutions found */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <Trophy size={14} className="text-amber-400" />
        <span className="text-xs font-mono text-[var(--text-secondary)]">
          Solutions <span className="text-amber-400 font-semibold">{solutionsFound}</span>
        </span>
      </div>
    </div>
  );
}
