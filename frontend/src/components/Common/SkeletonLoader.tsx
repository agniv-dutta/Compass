import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'chart' | 'row' | 'text' | 'metric';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 1 }) => {
  return (
    <div className="skeleton-group">
      {Array.from({ length: count }).map((_, idx) => {
        switch (type) {
          case 'card':
            return (
              <div key={idx} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-line short" />
                  <div className="skeleton-badge" />
                </div>
                <div className="skeleton-block" />
                <div className="skeleton-row">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
                <div className="skeleton-metrics">
                  <div className="skeleton-metric" />
                  <div className="skeleton-metric" />
                  <div className="skeleton-metric" />
                </div>
              </div>
            );
          case 'chart':
            return (
              <div key={idx} className="skeleton-chart">
                <div className="skeleton-line short" />
                <div className="skeleton-chart-area" />
              </div>
            );
          case 'row':
            return (
              <div key={idx} className="skeleton-row-item">
                <div className="skeleton-circle" />
                <div className="skeleton-lines">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            );
          case 'metric':
            return (
              <div key={idx} className="skeleton-metric-card">
                <div className="skeleton-line short" />
                <div className="skeleton-line large" />
              </div>
            );
          default:
            return (
              <div key={idx} className="skeleton-line-block">
                <div className="skeleton-line full" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line short" />
              </div>
            );
        }
      })}
    </div>
  );
};
