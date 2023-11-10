export function generateBoard(rows, cols, mines) {
    const board = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => ({ value: "", revealed: false, flagged: false, i, j })));
    
    while (mines > 0) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (board[row][col].value !== 'X') {
            board[row][col].value = 'X';
            mines--;
        }
    }
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col].value === 'X') {
                continue;
            }
            let count = 0;
            for (let i = row - 1; i <= row + 1; i++) {
                for (let j = col - 1; j <= col + 1; j++) {
                    if (i < 0 || i >= rows || j < 0 || j >= cols) {
                        continue;
                    }
                    if (board[i][j].value === 'X') {
                        count++;
                    }
                }
            }
            board[row][col].value = count === 0 ? '' : count.toString();
        }
    }

    return board;
}