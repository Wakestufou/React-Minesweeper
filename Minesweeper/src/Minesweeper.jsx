import { useState } from "react"
import { generateBoard } from "./utils/generateBoard";
import styles from './Minesweeper.module.scss'
import { GameOver } from "./GameOver/GameOver";

function Minesweeper() {
	const [board, setBoard] = useState(generateBoard(10, 10, 10));
	const [gameOver, setGameOver] = useState({lose: false, win: false});
	const [timeOut, setTimeOut] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [error, setError] = useState("");
	const [showResult, setShowResult] = useState(false);

	function newGame(e) {
		setError(() => "");
		e.preventDefault();
		timeOut.forEach((timeout) => clearTimeout(timeout));
		setTimeOut([]);
		try {
			setBoard(generateBoard(e.target.width.value, e.target.height.value, e.target.mines.value));
		}
		catch (err) {
			setError(() => err.message);
			return;
		}
		setGameOver(false);
	}

	function checkLose(board) {
		let lose = false;
		let win = true;
		for (let row of board) {
			for (let cell of row) {
				if (!cell.revealed && cell.value !== "X") {
					win = false;
				}

				if (cell.revealed && cell.value === "X") {
					lose = true;
					break;
				}
			}
		}
		return {lose, win};
	}

	function discoverAdjacent(tmpBoard, i, j) {
		const adjacent = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1],
			[1, -1], [1, 0], [1, 1]
		];
		for (let [x, y] of adjacent) {
			// Verif si on est dans le board
			if (i + x < 0 || i + x >= tmpBoard.length || j + y < 0 || j + y >= tmpBoard[0].length) continue; 
			// Verif si la case est déjà révélée
			if (tmpBoard[i + x][j + y].revealed) continue;
			tmpBoard[i + x][j + y].revealed = true;

			// Si la case est vide, on continue la récursion
			if (tmpBoard[i + x][j + y].value === "") {
				discoverAdjacent(tmpBoard, i + x, j + y);
			}
		}
		return tmpBoard;
	}

	function handleClick(i, j) {
		if (gameOver.lose || gameOver.win) return;
		let newBoard = [...board];
		newBoard[i][j].revealed = true;
		newBoard[i][j].flagged = false;
		if (newBoard[i][j].value === "") {
			newBoard = discoverAdjacent(newBoard, i, j);
		}

		setBoard(newBoard);
		const {lose, win} = checkLose(newBoard);
		if (lose || win) {
			setGameOver({lose, win});
			setShowResult(true);
			const bombToReveal = newBoard.flatMap((row) => row.filter(cell => cell.value === "X" && !cell.revealed));
			// Reveals all bombs one by one
			const timeOut = bombToReveal.map((cell, i) => {
				return setTimeout(() => {
					const newBoard = [...board];
					newBoard[cell.i][cell.j].revealed = true;
					setBoard(newBoard);
				}, 200 * i);
			});
			setTimeOut(timeOut);
		}
	}

	function handleContextMenu(e, i, j) {
		if (gameOver.lose || gameOver.win) return;
		e.preventDefault();
		const newBoard = [...board];
		if (newBoard[i][j].revealed) return;
		newBoard[i][j].flagged = !newBoard[i][j].flagged;
		setBoard(newBoard);
	}

	function onClickGameOver() {
		setShowResult(false);
	}
	

	return (
		<>
		<h1 className={styles.title} onClick={() => setShowForm(s => !s)}>Minesweeper</h1>
		<form onSubmit={(e) => newGame(e)} className={`${styles.form} ${showForm ? styles.showForm : ""}`}>
			<div>
				<label htmlFor="width" className={styles.label}>Width :</label>
				<input type="number" id="width" min={0} max={40} defaultValue={10} className={styles.input}/>
				<label htmlFor="height" className={styles.label} >Height :</label>
				<input type="number" id="height" min={0} max={40} defaultValue={10} className={styles.input}/>
				<label htmlFor="mines" className={styles.label}>Mines :</label>
				<input type="number" id="mines" min={0} defaultValue={10} className={styles.input}/>
				<button type="submit" className={styles.button}>New Game</button>
			</div>
		</form>
		{(showResult) && <GameOver onClick={onClickGameOver} result={gameOver.lose ? false : true}/>}
		{error && <h2 className={styles.error}>{error}</h2>}
		<table className={styles.board}>
			<tbody>
				{board.map((row, i) => (
					<tr key={i}>
						{row.map((col, j) => (
							<td 
								key={j} 
								onClick={() => handleClick(i, j)}
								onContextMenu={(e) => handleContextMenu(e, i, j)}
								className={`${styles.cell} ${board[i][j].revealed && board[i][j].value === "X" ? `${styles.revealed} ${styles.danger}` : (board[i][j].revealed ? styles.revealed : "")}`}
							>{board[i][j].revealed ? (board[i][j].value === "X" ? "💣" : board[i][j].value) : (board[i][j].flagged ? "🚩" : "")}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
		</>
	)
}

export default Minesweeper
