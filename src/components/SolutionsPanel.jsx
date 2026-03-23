import React from 'react';
import { Trophy, Crown, Eye } from 'lucide-react';

function MiniBoard({ queens, n, isActive, onClick }) {
  const cellSize = Math.max(12, Math.min(20, Math.floor(140 / n)));

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 cursor-pointer
        hover:border-[var(--accent-amber)] hover:bg-amber-400/5
        ${isActive
          ? 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
          : 'border-[var(--border-color)] bg-[var(--bg-tertiary)]'
        }
      `}
    >
      {Array.from({ length: n }, (_, r) => (
        <div key={r} className="flex gap-px">
          {Array.from({ length: n }, (_, c) => {
            const hasQueen = queens[r] === c;
            const isLight = (r + c) % 2 === 0;
            return (
              <div
                key={c}
                className={`flex items-center justify-center rounded-sm
                  ${isLight ? 'bg-[var(--cell-light)]' : 'bg-[var(--cell-dark)]'}
                  ${hasQueen ? 'bg-amber-400/30' : ''}
                `}
                style={{ width: cellSize, height: cellSize }}
              >
                {hasQueen && (
                  <Crown
                    size={Math.max(7, cellSize - 5)}
                    className="text-amber-400"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </button>
  );
}

export default function SolutionsPanel({ solutions, n, onJumpToSolution, activeSolutionIndex }) {
  if (solutions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="p-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
          <Trophy size={24} className="text-[var(--text-muted)] opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)]">No solutions yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 opacity-60">
            Press play to watch the algorithm discover solutions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
        <Trophy size={16} className="text-amber-400" />
        <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
          Solutions Found
        </h3>
        <span className="ml-auto text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
          {solutions.length}
        </span>
      </div>

      {/* Solutions grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
        {solutions.map((sol, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono font-semibold text-[var(--text-muted)]">
              #{i + 1}
            </span>
            <MiniBoard
              queens={sol.queens}
              n={n}
              isActive={activeSolutionIndex === i}
              onClick={() => onJumpToSolution(sol.stepIndex)}
            />
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]">
        <Eye size={10} />
        <span>Click a solution to jump to that step</span>
      </div>
    </div>
  );
}
