import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import styles from './Navigation.module.scss';

export const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Home', to: '/' },
    { name: 'Exercise', to: '/exercise' },
    { name: 'Muscle Group', to: '/muscle-group' },
    { name: 'Workout', to: '/workout' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          GymTracker
        </NavLink>

        <ul className={styles.desktopMenu}>
          {links.map((l) => (
            <li className={styles.menuItem} key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? 'active' : ''}`
                }
              >
                {l.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className={styles.mobileToggle}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul className={`${styles.mobileMenu} ${open ? styles.open : ''}`}>
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? 'active' : ''}`
              }
            >
              {l.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
