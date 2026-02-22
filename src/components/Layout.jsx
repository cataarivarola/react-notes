import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import styles from './Layout.module.css'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef(null)
  const isHome = location.pathname === '/'

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className={styles.wrapper}>
      <Header onMenuClick={() => setSidebarOpen((o) => !o)} sidebarOpen={sidebarOpen} />
      <div className={styles.body}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <Sidebar currentPath={location.pathname} />
        </aside>
        <div
          className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          aria-hidden="true"
        />
        <main ref={mainRef} className={styles.main}>
          <article className={styles.content}>
            {!isHome && (
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => navigate(-1)}
                title="返回上一页"
              >
                ← 返回
              </button>
            )}
            <Outlet />
          </article>
        </main>
      </div>
    </div>
  )
}
