import { NavLink } from 'react-router-dom'
import { navConfig } from '../config/nav'
import styles from './Sidebar.module.css'

export default function Sidebar({ currentPath }) {
  return (
    <nav className={styles.nav}>
      {navConfig.map((section) => (
        <div key={section.path} className={styles.section}>
          <div className={styles.sectionTitle}>{section.title}</div>
          <ul className={styles.list}>
            {section.children.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.linkActive : ''}`
                  }
                  end={item.path === '/'}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
