import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="layout">
      <Header
        title={title}
        rightElement={
          <NavLink to="/settings">Settings</NavLink>
        }
      />
      <main className="content">{children}</main>
      <nav className="bottom-nav">
        <NavLink to="/" end>Inbox</NavLink>
      </nav>
    </div>
  );
};

export default Layout;
