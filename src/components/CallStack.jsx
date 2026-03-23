import React from 'react';
import { Crown, Layers } from 'lucide-react';

export default function CallStack({ step, n }) {
  if (!step) return null;

  const { queens, depth, type, row, col } = step;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
        <Layers size={16} className="text-[var(--accent-cyan)]" />
        <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
          Call Stack
        </h3>
      </div>

      {/* Current function call */}
      <div className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        <code className="text-xs font-mono text-[var(--accent-cyan)]">
          rec(<span className="text-[var(--accent-amber)]">{type === 'SOLUTION' ? n : row}</span>)
        </code>
        {type !== 'SOLUTION' && (
          <div className="mt-1 text-xs font-mono text-[var(--text-muted)]">
            col = <span className="text-[var(--accent-purple)]">{col}</span>
          </div>
        )}
      </div>

      {/* Stack frames */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
        {queens.map((qCol, r) => (
          <div
            key={r}
            className="stack-item flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200"
            style={{
              animationDelay: `${r * 50}ms`,
              background: type === 'SOLUTION'
                ? 'rgba(251, 191, 36, 0.1)'
                : 'var(--bg-tertiary)',
              borderColor: type === 'SOLUTION'
                ? 'rgba(251, 191, 36, 0.3)'
                : 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-primary)] text-xs font-mono font-semibold text-[var(--text-muted)]">
              {r}
            </div>
            <Crown size={14} className="text-amber-400" />
            <span className="text-xs font-mono text-[var(--text-primary)]">
              row {r}, col {qCol}
            </span>
            <div className="ml-auto flex items-center gap-0.5">
              {Array.from({ length: n }, (_, c) => (
                <div
                  key={c}
                  className={`w-2 h-2 rounded-sm ${
                    c === qCol
                      ? type === 'SOLUTION'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                      : 'bg-[var(--bg-primary)]'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Current trying indicator */}
        {(type === 'TRYING' || type === 'CONFLICT') && (
          <div
            className={`stack-item flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed
              ${type === 'CONFLICT'
                ? 'border-[var(--accent-rose)]/50 bg-[var(--accent-rose)]/5'
                : 'border-[var(--accent-indigo)]/50 bg-[var(--accent-indigo)]/5'
              }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-primary)] text-xs font-mono font-semibold text-[var(--text-muted)]">
              {row}
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {type === 'TRYING' ? '? trying' : '✗ conflict'} col {col}
            </span>
          </div>
        )}

        {/* Empty state */}
        {queens.length === 0 && type !== 'TRYING' && type !== 'CONFLICT' && (
          <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
            <Layers size={24} className="opacity-30 mb-2" />
            <span className="text-xs">No queens placed yet</span>
          </div>
        )}
      </div>

      {/* Depth indicator */}
      <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">Depth</span>
        <div className="flex gap-1">
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm transition-all duration-200 ${
                i < queens.length
                  ? type === 'SOLUTION'
                    ? 'bg-amber-400'
                    : 'bg-[var(--accent-purple)]'
                  : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
