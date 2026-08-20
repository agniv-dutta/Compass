import React from 'react';
import { useAppRoute, type AppRoute } from '../../hooks/useAppRoute';
import './Sidebar.css';

interface NavItem {
  label: string;
  icon: string;
}

export const Sidebar: React.FC = () => {
  const { route, navigate } = useAppRoute();

  const navItems: Record<string, NavItem> = {
    dashboard: { label: 'Dashboard', icon: '\u25A6' },
    forecasts: { label: 'Forecasts', icon: '\u25B6' },
    performance: { label: 'Performance', icon: '\u25CF' },
    scenarios: { label: 'Scenarios', icon: '\u25A0' },
    settings: { label: 'Settings', icon: '\u2699' },
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          Smart Buy
        </h1>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(navItems).map(([key, item]) => (
          <button
            key={key}
            className={`nav-item ${route === key ? 'active' : ''}`}
            onClick={() => navigate(key as AppRoute)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {route === key && <span className="active-indicator" />}
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
