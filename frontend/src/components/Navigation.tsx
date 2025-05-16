import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';

const Nav = styled.nav`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Inner = styled.div`
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0366d6;
  text-decoration: none;
  margin-right: .625rem;
`;

const DesktopMenu = styled.ul<{ open: boolean }>`
  list-style: none;
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.li``;

const StyledLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;

  &.active {
    color: #0366d6;
    font-weight: 600;
  }

  &:hover {
    color: #0366d6;
  }
`;

const MobileToggle = styled.button`
  background: none;
  border: none;
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul<{ open: boolean }>`
  list-style: none;
  background: #fff;
  overflow: hidden;
  max-height: ${({ open }) => (open ? '500px' : '0')};
  transition: max-height 0.3s ease-in-out;
  margin: 0;
  padding: ${({ open }) => (open ? '0.5rem 1rem' : '0 1rem')};

  li {
    margin: 0.5rem 0;
  }
`;

export const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Home', to: '/' },
    { name: 'Exercise', to: '/exercise' },
    { name: 'Muscle Group', to: '/muscle-group' },
    { name: 'Working Set', to: '/working-set' },
    { name: 'Workout', to: '/workout' },
  ];

  return (
    <Nav>
      <Inner>
        <Logo to="/">GymTracker</Logo>

        <DesktopMenu open={open}>
          {links.map((l) => (
            <MenuItem key={l.to}>
              <StyledLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.name}
              </StyledLink>
            </MenuItem>
          ))}
        </DesktopMenu>

        <MobileToggle onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </MobileToggle>
      </Inner>

      <MobileMenu open={open}>
        {links.map((l) => (
          <li key={l.to}>
            <StyledLink
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.name}
            </StyledLink>
          </li>
        ))}
      </MobileMenu>
    </Nav>
  );
};
