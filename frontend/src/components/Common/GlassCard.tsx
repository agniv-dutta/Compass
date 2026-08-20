import React from 'react';
import '../../styles/glassmorphism.css';

interface GlassCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  accentBorder?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  elevated = false,
  accentBorder = false,
  className = '',
}) => {
  const classes = [
    'glass-panel',
    elevated && 'glass-panel-elevated',
    accentBorder && 'glass-accent-border',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};
