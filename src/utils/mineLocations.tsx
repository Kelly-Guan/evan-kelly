export const mineLocations = (board: { rows: number; cols: number; mines: number }) => {
    const mineLocations = new Set<string>();

    while (mineLocations.size < board.mines) {
        const row = Math.floor(Math.random() * board.rows);
        const col = Math.floor(Math.random() * board.cols);
        const key = `${row},${col}`;
        if (!mineLocations.has(key)) {
            mineLocations.add(key);
        }
    }

    console.log("mineLocations: ", mineLocations)

    return mineLocations;
};
