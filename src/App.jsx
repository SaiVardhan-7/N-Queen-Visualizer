import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Crown, Github, Sparkles } from 'lucide-react';
import { generateSteps } from './engine/nqueens.js';
import Board from './components/Board.jsx';
import Controls from './components/Controls.jsx';
import CallStack from './components/CallStack.jsx';
import StatsBar from './components/StatsBar.jsx';
import Legend from './components/Legend.jsx';
import SolutionsPanel from './components/SolutionsPanel.jsx';

export default function App() {
  const [boardSize, setBoardSize] = useState(4);
  const [speed, setSpeed] = useState(2);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Generate all algorithm steps eagerly
  const { steps, totalSolutions } = useMemo(() => generateSteps(boardSize), [boardSize]);

  // Compute cumulative solution counts for each step
  const solutionCounts = useMemo(() => {
    let count = 0;
    return steps.map((s) => {
      if (s.type === 'SOLUTION') count = s.solutionNumber;
      return count;
    });
  }, [steps]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Enrich the current step with cumulative solutionNumber
  const enrichedStep = useMemo(() => {
    if (!currentStep) return null;
    return {
      ...currentStep,
      solutionNumber: solutionCounts[currentStepIndex] || 0,
    };
  }, [currentStep, solutionCounts, currentStepIndex]);

  // Collect all solutions discovered up to the current step
  const discoveredSolutions = useMemo(() => {
    const sols = [];
    for (let i = 0; i <= currentStepIndex; i++) {
      if (steps[i].type === 'SOLUTION') {
        sols.push({ queens: [...steps[i].queens], stepIndex: i });
      }
    }
    return sols;
  }, [steps, currentStepIndex]);

  // Which solution is currently active (if we're on a SOLUTION step)
  const activeSolutionIndex = useMemo(() => {
    if (currentStep?.type !== 'SOLUTION') return -1;
    return discoveredSolutions.findIndex((s) => s.stepIndex === currentStepIndex);
  }, [currentStep, discoveredSolutions, currentStepIndex]);

  const handleJumpToSolution = useCallback((stepIndex) => {
    setIsPlaying(false);
    setCurrentStepIndex(stepIndex);
  }, []);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const ms = Math.max(30, 500 / speed);
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, ms);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((p) => Math.min(p + 1, steps.length - 1));
  }, [steps.length]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((p) => Math.max(p - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleGoToStart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleGoToEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(steps.length - 1);
  }, [steps.length]);

  const handleBoardSizeChange = useCallback((size) => {
    setIsPlaying(false);
    setBoardSize(size);
    setCurrentStepIndex(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        handleStepForward();
      } else if (e.key === 'ArrowLeft' || e.key === 'j') {
        handleStepBackward();
      } else if (e.key === 'r') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handlePlayPause, handleStepForward, handleStepBackward, handleReset]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-indigo)] shadow-[var(--glow-purple)]">
            <Crown size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-[var(--accent-purple)] via-[var(--accent-cyan)] to-[var(--accent-emerald)] bg-clip-text text-transparent">
              N-Queens Visualizer
            </h1>
            <p className="text-xs text-[var(--text-muted)] -mt-0.5">
              Backtracking Algorithm — Step by Step
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {totalSolutions} solutions for {boardSize}×{boardSize}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[10px] font-mono">Space</kbd>
            <span>Play</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[10px] font-mono ml-2">←→</kbd>
            <span>Step</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex min-h-0">
        {/* Left: Board + Controls */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 min-w-0">
          {/* Stats bar */}
          <StatsBar
            step={enrichedStep}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            n={boardSize}
          />

          {/* Board */}
          <div className="flex items-center justify-center">
            <Board n={boardSize} step={enrichedStep} />
          </div>

          {/* Controls */}
          <div className="w-full max-w-md">
            <Controls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onGoToStart={handleGoToStart}
              onGoToEnd={handleGoToEnd}
              speed={speed}
              onSpeedChange={setSpeed}
              boardSize={boardSize}
              onBoardSizeChange={handleBoardSizeChange}
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              disabled={steps.length === 0}
            />
          </div>
        </div>

        {/* Right sidebar: Call Stack + Solutions + Legend */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <CallStack step={enrichedStep} n={boardSize} />
          </div>
          <div className="p-4 border-b border-[var(--border-color)]">
            <SolutionsPanel
              solutions={discoveredSolutions}
              n={boardSize}
              onJumpToSolution={handleJumpToSolution}
              activeSolutionIndex={activeSolutionIndex}
            />
          </div>
          <div className="shrink-0 p-4">
            <Legend />
          </div>
        </aside>
      </main>
    </div>
  );
}
