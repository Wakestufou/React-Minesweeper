import styles from './GameOver.module.css';

export function GameOver({ onClick, result }) {
    return (
        <div className={styles.gameOver} onClick={onClick}>
            <h2>{!result ? "Game Over" : "You win !"}</h2>
        </div>
    )
} 