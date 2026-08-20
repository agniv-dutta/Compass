import React from 'react';
import { Header } from '../components/Common/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GlassCard } from '../components/Common/GlassCard';

export const Settings: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Settings" subtitle="Application configuration" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <GlassCard elevated>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#d4af37', marginBottom: '1rem' }}>
                API Configuration
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    API Base URL
                  </label>
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 76, 92, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#f5f1e8',
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '0.875rem',
                  }}>
                    http://localhost:3001
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                    Environment
                  </label>
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 76, 92, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#10b981',
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '0.875rem',
                  }}>
                    development
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard elevated>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#d4af37', marginBottom: '1rem' }}>
                Data Sources
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['LME Aluminum Spot Price', 'Brent Crude (WTI)', 'USD/INR Exchange Rate', 'Bauxite Import Pricing', 'Energy Index'].map((source) => (
                  <div key={source} style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(15, 76, 92, 0.1)',
                    borderRadius: '0.375rem',
                    color: '#d1d5db',
                    fontSize: '0.875rem',
                    borderLeft: '3px solid #0f4c5c',
                  }}>
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
