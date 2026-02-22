import styles from './Header.module.css'

export default function Header({ onMenuClick, sidebarOpen }) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
      >
        <span className={styles.menuIcon} />
        <span className={styles.menuIcon} />
        <span className={styles.menuIcon} />
      </button>
      <a href="/" className={styles.logo}>
        <span className={styles.logoIcon} aria-hidden>
          <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="React">
            <circle cx="0" cy="0" r="2.05" fill="var(--react-cyan)" />
            <g stroke="var(--react-cyan)" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </span>
        React 学习笔记
      </a>
    </header>
  )
}
