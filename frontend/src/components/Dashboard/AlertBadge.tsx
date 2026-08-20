import React from 'react';
import type { BuySignal } from '../../services/types';
import { GlassCard } from '../Common/GlassCard';
import './Dashboard.css';

interface AlertBadgeProps {
  signal: BuySignal;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ signal }) => {
  const statusColors: Record<string, string> = {
    buy: 'status-buy',
    hold: 'status-hold',
    wait: 'status-wait',
  };

  return (
    <GlassCard className={`alert-badge ${statusColors[signal.status]}`}>
      <div className="alert-content">
        <div className="alert-header">
          <h4 className="alert-title">{signal.material.toUpperCase()}</h4>
          <span className={`status-badge ${signal.status}`}>
            {signal.status.toUpperCase()}
          </span>
        </div>

        <p className="alert-reasoning">{signal.reasoning}</p>

        <div className="alert-footer">
          <div className="savings-estimate">
            <span className="label">Est. Savings</span>
            <span className="value">
              {(signal.estimated_savings / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
          <span className="confidence-text">{signal.confidence}% confidence</span>
        </div>
      </div>
    </GlassCard>
  );
};
