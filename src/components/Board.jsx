import React from 'react';
import { Crown, X } from 'lucide-react';

export default function Board({ n, step }) {
  if (!step) return null;

  const { type, row, col, queens, conflicts } = step;

  // Build a map of queen positions for quick lookup
  const queenMap = new Map();
  queens.forEach((c, r) => queenMap.set(`${r}-${c}`, true));

  // Build conflict cell set
  const conflictSet = new Set();
  conflicts.forEach(({ row: cr, col: cc }) => conflictSet.add(`${cr}-${cc}`));

  // Determine the max board size for responsive calculations
  const cellSize = Math.max(36, Math.min(72, Math.floor(520 / n)));

  function getCellClass(r, c) {
    const isLight = (r + c) % 2 === 0;
    const base = isLight
      ? 'bg-[var(--cell-light)]'
      : 'bg-[var(--cell-dark)]';

    // Current cell being evaluated
    if (r === row && c === col) {
      if (type === 'TRYING') return `${base} cell-trying`;
      if (type === 'CONFLICT') return `${base} cell-conflict`;
      if (type === 'PLACED') return `${base} cell-placed`;
      if (type === 'BACKTRACK') return `${base}`;
    }

    // Cells that cause the conflict
    if (type === 'CONFLICT' && conflictSet.has(`${r}-${c}`)) {
      return `${base} cell-conflict`;
    }

    // All cells glow during solution
    if (type === 'SOLUTION' && queenMap.has(`${r}-${c}`)) {
      return `${base} cell-solution`;
    }

    return base;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Column labels */}
      <div className="flex" style={{ marginLeft: cellSize + 4 }}>
        {Array.from({ length: n }, (_, c) => (
          <div
            key={c}
            className="flex items-center justify-center text-xs font-mono font-semibold text-[var(--text-muted)]"
            style={{ width: cellSize, height: 20 }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Board rows */}
      {Array.from({ length: n }, (_, r) => (
        <div key={r} className="flex items-center gap-1">
          {/* Row label */}
          <div
            className="flex items-center justify-center text-xs font-mono font-semibold text-[var(--text-muted)]"
            style={{ width: 20, height: cellSize }}
          >
            {r}
          </div>

          {/* Cells */}
          {Array.from({ length: n }, (_, c) => {
            const hasQueen = queenMap.has(`${r}-${c}`);
            const isCurrentTrying = r === row && c === col && type === 'TRYING';
            const isConflictTarget = r === row && c === col && type === 'CONFLICT';

            return (
              <div
                key={`${r}-${c}`}
                className={`
                  relative flex items-center justify-center
                  rounded-lg border border-[var(--border-color)]
                  transition-all duration-200
                  ${getCellClass(r, c)}
                `}
                style={{ width: cellSize, height: cellSize }}
              >
                {/* Queen icon */}
                {hasQueen && (
                  <Crown
                    className="queen-icon text-amber-400"
                    size={Math.max(16, cellSize * 0.5)}
                    strokeWidth={2}
                  />
                )}

                {/* Trying indicator (semi-transparent queen) */}
                {isCurrentTrying && !hasQueen && (
                  <Crown
                    className="text-indigo-400 opacity-50"
                    size={Math.max(16, cellSize * 0.5)}
                    strokeWidth={2}
                  />
                )}

                {/* Conflict X marker */}
                {isConflictTarget && (
                  <X
                    className="conflict-marker text-rose-400 absolute"
                    size={Math.max(16, cellSize * 0.55)}
                    strokeWidth={3}
                  />
                )}

                {/* Conflicting source cells marker */}
                {type === 'CONFLICT' && conflictSet.has(`${r}-${c}`) && !(r === row && c === col) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-400 conflict-marker" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
