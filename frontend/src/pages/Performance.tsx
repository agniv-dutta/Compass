import React, { useEffect, useState } from 'react';
import { Header } from '../components/Common/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GlassCard } from '../components/Common/GlassCard';
import { apiClient } from '../services/api';
import type { ModelPerformance } from '../services/types';

export const Performance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<ModelPerformance[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.getModelPerformance();
      setPerformanceData(data);
    };
    load();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Model Performance" subtitle="Backtesting metrics and accuracy analysis" />

        <div className="forecast-cards-container">
          {performanceData.map((perf) => (
            <GlassCard key={perf.material} elevated>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#d4af37',
                  textTransform: 'uppercase',
                  fontFamily: 'Courier Prime, monospace',
                  marginBottom: '1rem',
                }}>
                  {perf.material}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>MAPE</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', fontFamily: 'Courier Prime, monospace' }}>{perf.mape}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Directional Accuracy</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', fontFamily: 'Courier Prime, monospace' }}>{perf.directional_accuracy}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>RMSE</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b87333', fontFamily: 'Courier Prime, monospace' }}>{perf.rmse}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Max Error</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', fontFamily: 'Courier Prime, monospace' }}>{perf.max_error}</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  Backtesting: {perf.backtesting_period.start} to {perf.backtesting_period.end}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
