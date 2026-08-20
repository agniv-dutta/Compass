import React from 'react';
import { GlassCard } from './GlassCard';

interface MetricBoxProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
}

export const MetricBox: React.FC<MetricBoxProps> = ({ label, value, change, icon }) => {
  const isPositive = change && change > 0;

  return (
    <GlassCard>
      <div className="metric-box">
        {icon && <span className="metric-icon">{icon}</span>}
        <div className="metric-info">
          <span className="metric-label">{label}</span>
          <span className="metric-value">{value}</span>
          {change !== undefined && (
            <span className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '\u2191' : '\u2193'} {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
