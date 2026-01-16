import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, rightElement }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      {rightElement && <div className="header-right">{rightElement}</div>}
    </header>
  );
};

export default Header;
