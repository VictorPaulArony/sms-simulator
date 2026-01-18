import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showSettingsLink?: boolean;
  pageType?: 'inbox' | 'conversation' | 'settings';
}

const Layout: React.FC<LayoutProps> = ({ children, title, showSettingsLink, pageType }) => {
  let rightElement = null;
  if (pageType === 'inbox') {
    rightElement = (
      <>
        <span className="material-symbols-outlined">search</span>
        <span className="material-symbols-outlined">delete</span>
        {showSettingsLink && <NavLink to="/settings" className="settings-link">
          <span className="material-symbols-outlined">more_vert</span>
        </NavLink>}
      </>
    );
  } else if (pageType === 'conversation') {
    rightElement = (
      <>
        <span className="material-symbols-outlined">delete</span>
        {showSettingsLink && <NavLink to="/settings" className="settings-link">
          <span className="material-symbols-outlined">more_vert</span>
        </NavLink>}
      </>
    );
  } else if (showSettingsLink) {
    rightElement = <NavLink to="/settings" className="settings-link">
      <span className="material-symbols-outlined">more_vert</span>
    </NavLink>;
  }

  return (
    <div className="layout">
      <Header
        title={title}
        showBackButton={pageType === 'conversation'}
        rightElement={rightElement}
      />
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
