export function revealCells(
  board: (number | "M")[][],
  revealed: boolean[][],
  row: number,
  col: number,
): boolean[][] {
  const rows = board.length;
  const cols = board[0].length;

  function inBounds(r: number, c: number) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }

  if (!inBounds(row, col) || revealed[row][col]) return revealed;

  revealed[row][col] = true;

  if (board[row][col] === "M") return revealed;

  if (board[row][col] === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) {
          revealed = revealCells(board, revealed, row + dr, col + dc);
        }
      }
    }
  }

  return revealed;
}
