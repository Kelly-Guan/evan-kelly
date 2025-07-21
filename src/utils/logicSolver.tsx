// Returns true if the board is logically solvable from startCell without guessing
export function isLogicallySolvable(
    board: (number | "M")[][],
    startCell: { row: number; col: number }
  ): boolean {
    const rows = board.length;
    const cols = board[0].length;
    const revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    const flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
  
    // Reveal the start cell and flood fill zeros
    function reveal(r: number, c: number) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      if (revealed[r][c]) return;
      revealed[r][c] = true;
      if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) reveal(r + dr, c + dc);
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
          if (!revealed[r][c] || typeof board[r][c] !== "number" || board[r][c] === 0) continue;
          // Count adjacent unrevealed and flagged cells
          let unrevealed = [];
          let flagCount = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (!revealed[nr][nc] && !flagged[nr][nc]) unrevealed.push([nr, nc]);
                if (flagged[nr][nc]) flagCount++;
              }
            }
          }
          // If number of unrevealed + flagged == cell number, flag all unrevealed
          if (unrevealed.length + flagCount === board[r][c]) {
            for (const [nr, nc] of unrevealed) {
              if (!flagged[nr][nc]) {
                flagged[nr][nc] = true;
                progress = true;
              }
            }
          }
          // If flagged == cell number, reveal all other unrevealed
          if (flagCount === board[r][c]) {
            for (const [nr, nc] of unrevealed) {
              if (!flagged[nr][nc] && !revealed[nr][nc]) {
                revealed[nr][nc] = true;
                if (board[nr][nc] === 0) reveal(nr, nc);
                progress = true;
              }
            }
          }
        }
      }
    }
  
    // If all non-mine cells are revealed, it's solvable
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] !== "M" && !revealed[r][c]) return false;
      }
    }
    return true;
  }