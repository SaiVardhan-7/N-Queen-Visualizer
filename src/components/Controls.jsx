import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';

export default function Controls({
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onGoToStart,
  onGoToEnd,
  speed,
  onSpeedChange,
  boardSize,
  onBoardSizeChange,
  currentStep,
  totalSteps,
  disabled,
}) {
  const speedLabels = ['0.5×', '1×', '2×', '4×', '8×', '16×'];
  const speedValues = [0.5, 1, 2, 4, 8, 16];
  const speedIndex = speedValues.indexOf(speed);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Playback buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          id="btn-go-start"
          onClick={onGoToStart}
          disabled={disabled || currentStep === 0}
          className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] 
                     text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go to start"
        >
          <ChevronFirst size={18} />
        </button>

        <button
          id="btn-step-back"
          onClick={onStepBackward}
          disabled={disabled || currentStep === 0}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]
                     text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step backward"
        >
          <SkipBack size={20} />
        </button>

        <button
          id="btn-play-pause"
          onClick={onPlayPause}
          disabled={disabled}
          className={`p-3.5 rounded-xl border transition-all duration-200
            ${isPlaying
              ? 'bg-[var(--accent-rose)]/20 border-[var(--accent-rose)] text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/30'
              : 'bg-[var(--accent-purple)]/20 border-[var(--accent-purple)] text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/30'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          id="btn-step-forward"
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]
                     text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step forward"
        >
          <SkipForward size={20} />
        </button>

        <button
          id="btn-go-end"
          onClick={onGoToEnd}
          disabled={disabled || currentStep >= totalSteps - 1}
          className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]
                     text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]
                     transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go to end"
        >
          <ChevronLast size={18} />
        </button>

        <div className="w-px h-8 bg-[var(--border-color)] mx-1" />

        <button
          id="btn-reset"
          onClick={onReset}
          className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]
                     text-[var(--text-secondary)] hover:text-[var(--accent-amber)] hover:border-[var(--accent-amber)]
                     transition-all duration-200"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-[var(--text-muted)] min-w-[40px] text-right">
          {currentStep}
        </span>
        <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-color)]">
          <div
            className="progress-fill h-full rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]"
            style={{ width: totalSteps > 0 ? `${(currentStep / (totalSteps - 1)) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)] min-w-[40px]">
          {totalSteps - 1}
        </span>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Gauge size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Speed</span>
        </div>
        <div className="flex-1 flex items-center gap-1">
          {speedValues.map((v, i) => (
            <button
              key={v}
              onClick={() => onSpeedChange(v)}
              className={`flex-1 py-1 rounded text-xs font-mono font-semibold transition-all duration-200
                ${speed === v
                  ? 'bg-[var(--accent-purple)] text-white shadow-[var(--glow-purple)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-color)]'
                }`}
            >
              {speedLabels[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Board size */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Board
        </span>
        <div className="flex-1 flex items-center gap-1">
          {[4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => onBoardSizeChange(s)}
              className={`flex-1 py-1.5 rounded text-sm font-semibold transition-all duration-200
                ${boardSize === s
                  ? 'bg-[var(--accent-indigo)] text-white shadow-[var(--glow-purple)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-color)]'
                }`}
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
