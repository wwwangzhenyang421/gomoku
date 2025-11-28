import styles from './StartScreen.module.css'

export default function StartScreen({ onStart }) {
  return (
    <div className={styles.startScreen}>
      <div className={styles.startContent}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logoTitle}>
            五子棋
          </h1>
          <h2 className={styles.logoSubtitle}>
            Gomoku
          </h2>
        </div>

        <div className={styles.gameDescription}>
          <div className={styles.infoCard}>
            <p>您执黑子</p>
          </div>
          <div className={styles.infoCard}>
            <p>AI执白子</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className={styles.startButton}
        >
          开始游戏
        </button>
      </div>
    </div>
  )
}
