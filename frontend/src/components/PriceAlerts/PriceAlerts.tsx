import React, { useState } from 'react';
import { GlassCard } from '../Common/GlassCard';
import './PriceAlerts.css';

export interface PriceAlert {
  id: string;
  material: 'aluminum' | 'pvc';
  threshold: number;
  direction: 'above' | 'below';
  active: boolean;
  triggered: boolean;
  created: string;
}

interface PriceAlertConfigProps {
  currentPrice: Record<string, number>;
  unit: Record<string, string>;
  onAlertsChange?: (alerts: PriceAlert[]) => void;
}

const DEFAULT_ALERTS: PriceAlert[] = [
  { id: 'a1', material: 'aluminum', threshold: 2700, direction: 'below', active: true, triggered: false, created: '2025-01-15' },
  { id: 'a2', material: 'aluminum', threshold: 3000, direction: 'above', active: true, triggered: false, created: '2025-01-15' },
  { id: 'a3', material: 'pvc', threshold: 60, direction: 'below', active: false, triggered: true, created: '2025-01-10' },
];

export const PriceAlertConfig: React.FC<PriceAlertConfigProps> = ({ currentPrice, unit, onAlertsChange }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(DEFAULT_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState<'aluminum' | 'pvc'>('aluminum');
  const [newThreshold, setNewThreshold] = useState('');
  const [newDirection, setNewDirection] = useState<'above' | 'below'>('below');

  const unreadCount = alerts.filter((a) => a.triggered && a.active).length;

  const handleAdd = () => {
    const threshold = parseFloat(newThreshold);
    if (isNaN(threshold) || threshold <= 0) return;

    const alert: PriceAlert = {
      id: `alert-${Date.now()}`,
      material: newMaterial,
      threshold,
      direction: newDirection,
      active: true,
      triggered: false,
      created: new Date().toISOString().split('T')[0],
    };

    const updated = [...alerts, alert];
    setAlerts(updated);
    onAlertsChange?.(updated);
    setNewThreshold('');
    setShowForm(false);
  };

  const toggleAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    setAlerts(updated);
    onAlertsChange?.(updated);
  };

  const deleteAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    onAlertsChange?.(updated);
  };

  return (
    <div className="price-alerts-wrapper">
      <div className="alerts-header-row">
        <div className="alerts-header-text">
          <p className="section-kicker">Alerts</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 600, color: '#f5f1e8' }}>
            Price Alerts
          </h3>
        </div>
        <div className="alerts-header-actions">
          {unreadCount > 0 && (
            <span className="alert-count-badge">{unreadCount}</span>
          )}
          <button className="add-alert-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Alert'}
          </button>
        </div>
      </div>

      {showForm && (
        <GlassCard className="add-alert-form">
          <div className="form-row">
            <div className="form-field">
              <label>Material</label>
              <select value={newMaterial} onChange={(e) => setNewMaterial(e.target.value as 'aluminum' | 'pvc')}>
                <option value="aluminum">Aluminum</option>
                <option value="pvc">PVC</option>
              </select>
            </div>
            <div className="form-field">
              <label>Direction</label>
              <select value={newDirection} onChange={(e) => setNewDirection(e.target.value as 'above' | 'below')}>
                <option value="below">Drops below</option>
                <option value="above">Rises above</option>
              </select>
            </div>
            <div className="form-field">
              <label>Threshold ({unit[newMaterial]})</label>
              <input
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(e.target.value)}
                placeholder={String(currentPrice[newMaterial] || '')}
              />
            </div>
            <button className="form-submit" onClick={handleAdd}>Set Alert</button>
          </div>
          <p className="form-hint">
            Current price: {unit[newMaterial]}{(currentPrice[newMaterial] || 0).toLocaleString()}
          </p>
        </GlassCard>
      )}

      <div className="alerts-list">
        {alerts.length === 0 && (
          <p className="no-alerts">No alerts configured</p>
        )}
        {alerts.map((alert) => {
          const current = currentPrice[alert.material] || 0;
          const diff = alert.direction === 'above'
            ? ((alert.threshold - current) / current) * 100
            : ((current - alert.threshold) / current) * 100;
          const isClose = diff > 0 && diff < 8;

          return (
            <div
              key={alert.id}
              className={`alert-row ${alert.triggered ? 'triggered' : ''} ${!alert.active ? 'inactive' : ''}`}
            >
              <div className="alert-material-badge">
                {alert.material === 'aluminum' ? 'AL' : 'PVC'}
              </div>
              <div className="alert-details">
                <span className="alert-condition">
                  {alert.direction === 'above' ? 'Rises above' : 'Drops below'}{' '}
                  <strong>{unit[alert.material]}{alert.threshold.toLocaleString()}</strong>
                </span>
                <span className="alert-created">Created {alert.created}</span>
              </div>
              <div className="alert-status-col">
                {alert.triggered && alert.active && (
                  <span className="triggered-badge">TRIGGERED</span>
                )}
                {isClose && !alert.triggered && alert.active && (
                  <span className="approaching-badge">APPROACHING ({diff.toFixed(1)}%)</span>
                )}
              </div>
              <div className="alert-actions">
                <button
                  className={`toggle-switch ${alert.active ? 'on' : 'off'}`}
                  onClick={() => toggleAlert(alert.id)}
                >
                  <span className="toggle-knob" />
                </button>
                <button className="delete-btn" onClick={() => deleteAlert(alert.id)}>
                  \u2715
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
