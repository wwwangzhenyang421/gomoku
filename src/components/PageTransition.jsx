import { useEffect } from 'react'
import styles from './PageTransition.module.css'

export default function PageTransition({ onComplete }) {
  useEffect(() => {
    // 动画完成后立即调用回调
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, 1500) // 动画时长1.5秒

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={styles.transition}>
      <div className={styles.topTeeth}></div>
      <div className={styles.transitionBody}></div>
      <div className={styles.bottomTeeth}></div>
    </div>
  )
}

