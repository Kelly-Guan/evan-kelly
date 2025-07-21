export function isLogicallySolvable(
  board: (number | "M")[][],
  startCell: { row: number; col: number }
): boolean {
  const rows = board.length;
  const cols = board[0].length;
  const revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
  const flagged = Array.from({ length: rows }, () => Array(cols).fill(false));

  const DIRS = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];

  // Fast flood fill for zeroes
  function reveal(r: number, c: number) {
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
      if (revealed[cr][cc]) continue;

      revealed[cr][cc] = true;

      if (board[cr][cc] === 0) {
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !revealed[nr][nc]) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  }

  reveal(startCell.row, startCell.col);

  let progress = true;
  while (progress) {
    progress = false;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r][c];
        if (!revealed[r][c] || typeof cell !== "number" || cell === 0) continue;

        const unrevealed: [number, number][] = [];
        let flagCount = 0;

        for (const [dr, dc] of DIRS) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (flagged[nr][nc]) flagCount++;
          else if (!revealed[nr][nc]) unrevealed.push([nr, nc]);
        }

        // If we can deduce mines
        if (unrevealed.length + flagCount === cell) {
          for (const [nr, nc] of unrevealed) {
            if (!flagged[nr][nc]) {
              flagged[nr][nc] = true;
              progress = true;
            }
          }
        }

        // If we can safely reveal
        if (flagCount === cell) {
          for (const [nr, nc] of unrevealed) {
            if (!revealed[nr][nc] && !flagged[nr][nc]) {
              revealed[nr][nc] = true;
              if (board[nr][nc] === 0) reveal(nr, nc);
              progress = true;
            }
          }
        }
      }
    }
  }

  // Check if all non-mines were revealed
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "M" && !revealed[r][c]) {
        return false;
      }
    }
  }

  return true;
}
