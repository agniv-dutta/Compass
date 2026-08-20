import React, { useState } from 'react';
import './Sidebar.module.css';

interface NavItem {
  label: string;
  icon: string;
  active: boolean;
}

export const Sidebar: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems: Record<string, NavItem> = {
    dashboard: { label: 'Dashboard', icon: '\u25A6', active: activeNav === 'dashboard' },
    forecasts: { label: 'Forecasts', icon: '\u25B6', active: activeNav === 'forecasts' },
    performance: { label: 'Performance', icon: '\u25CF', active: activeNav === 'performance' },
    scenarios: { label: 'Scenarios', icon: '\u25A0', active: activeNav === 'scenarios' },
    settings: { label: 'Settings', icon: '\u2699', active: activeNav === 'settings' },
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <span className="logo-icon">\u2666</span> Smart Buy
        </h1>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(navItems).map(([key, item]) => (
          <button
            key={key}
            className={`nav-item ${item.active ? 'active' : ''}`}
            onClick={() => setActiveNav(key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.active && <span className="active-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="info-panel">
          <p className="info-label">Last Updated</p>
          <p className="info-value">{new Date().toLocaleDateString()}</p>
          <div className="status-dot" />
          <p className="status-text">Live Data Feed</p>
        </div>
      </div>
    </aside>
  );
};
