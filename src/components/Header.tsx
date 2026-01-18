import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, rightElement, showBackButton }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        {showBackButton && <button onClick={() => navigate(-1)} className="back-button">
          <span className="material-symbols-outlined">
            arrow_back
          </span>
        </button>}
        <h1>{title}</h1>
      </div>
      <div className="header-right">
        {rightElement}
      </div>
    </header>
  );
};

export default Header;
