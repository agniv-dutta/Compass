import React, { useEffect, useRef, useState } from 'react';
import './DeltaIndicator.css';

interface DeltaIndicatorProps {
  value: number;
  label?: string;
  period?: string;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  animate?: boolean;
  favorableDirection?: 'up' | 'down';
}

export const DeltaIndicator: React.FC<DeltaIndicatorProps> = ({
  value,
  label,
  period = 'MoM',
  size = 'md',
  showArrow = true,
  animate = true,
  favorableDirection = 'down',
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    const start = performance.now();
    const duration = 800;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * value);
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    };

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, animate]);

  const isPositive = value > 0;
  const isFavorable =
    (favorableDirection === 'down' && !isPositive) ||
    (favorableDirection === 'up' && isPositive);

  const arrow = isPositive ? '\u2191' : value < 0 ? '\u2193' : '\u2192';
  const sign = isPositive ? '+' : '';

  const sizeClasses = {
    sm: 'delta-sm',
    md: 'delta-md',
    lg: 'delta-lg',
  };

  return (
    <div className={`delta-indicator ${sizeClasses[size]} ${isFavorable ? 'favorable' : 'unfavorable'}`}>
      {label && <span className="delta-label">{label}</span>}
      <div className="delta-value-row">
        {showArrow && <span className="delta-arrow">{arrow}</span>}
        <span className="delta-value">
          {sign}{displayValue.toFixed(1)}%
        </span>
      </div>
      {period && <span className="delta-period">{period}</span>}
    </div>
  );
};
