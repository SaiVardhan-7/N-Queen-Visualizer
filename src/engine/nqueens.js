/**
 * N-Queens Backtracking Algorithm Engine
 * 
 * Follows the reference C++ logic exactly:
 *   rec(level):
 *     if level == n → solution found
 *     for col 0..n-1:
 *       if can_place(level, col) → place, recurse, backtrack
 *       else → conflict
 *
 * Generates an array of step objects for the visualizer to replay.
 */

/**
 * Step types:
 *  TRYING     – considering placing a queen at (row, col)
 *  CONFLICT   – can't place; shows conflicting cells
 *  PLACED     – queen successfully placed
 *  RECURSE    – about to recurse deeper (entering next row)
 *  BACKTRACK  – removing a queen (queens.pop_back)
 *  SOLUTION   – all n queens placed; a valid solution found
 */

function canPlace(queens, row, col) {
  const conflicts = [];
  for (let r = 0; r < queens.length; r++) {
    const c = queens[r];
    if (c === col) {
      conflicts.push({ row: r, col: c, type: 'column' });
    } else if (Math.abs(r - row) === Math.abs(c - col)) {
      conflicts.push({ row: r, col: c, type: 'diagonal' });
    }
  }
  return conflicts;
}

export function generateSteps(n) {
  const steps = [];
  let solutionCount = 0;

  function rec(level, queens) {
    if (level === n) {
      solutionCount++;
      steps.push({
        type: 'SOLUTION',
        row: -1,
        col: -1,
        queens: [...queens],
        conflicts: [],
        solutionNumber: solutionCount,
        depth: level,
      });
      return;
    }

    for (let col = 0; col < n; col++) {
      // TRYING step
      steps.push({
        type: 'TRYING',
        row: level,
        col,
        queens: [...queens],
        conflicts: [],
        depth: level,
      });

      const conflicts = canPlace(queens, level, col);

      if (conflicts.length === 0) {
        // PLACED step
        queens.push(col);
        steps.push({
          type: 'PLACED',
          row: level,
          col,
          queens: [...queens],
          conflicts: [],
          depth: level,
        });

        // Recurse
        rec(level + 1, queens);

        // BACKTRACK step
        queens.pop();
        steps.push({
          type: 'BACKTRACK',
          row: level,
          col,
          queens: [...queens],
          conflicts: [],
          depth: level,
        });
      } else {
        // CONFLICT step
        steps.push({
          type: 'CONFLICT',
          row: level,
          col,
          queens: [...queens],
          conflicts,
          depth: level,
        });
      }
    }
  }

  rec(0, []);
  return { steps, totalSolutions: solutionCount };
}
