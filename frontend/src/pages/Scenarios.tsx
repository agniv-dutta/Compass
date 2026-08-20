import React, { useState, useEffect } from 'react';
import { Header } from '../components/Common/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GlassCard } from '../components/Common/GlassCard';
import { ScenarioBuilder } from '../components/ScenarioBuilder/ScenarioBuilder';
import { apiClient } from '../services/api';
import type { MaterialForecast } from '../services/types';
import '../components/ScenarioBuilder/ScenarioBuilder.css';

export const Scenarios: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<'aluminum' | 'pvc'>('aluminum');
  const [forecasts, setForecasts] = useState<MaterialForecast[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.getAllForecasts();
      setForecasts(data);
    };
    load();
  }, []);

  const activeForecast = forecasts.find((f) => f.material === selectedMaterial);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Scenario Planning" subtitle="Interactive what-if analysis for procurement decisions" />

        <div className="material-toggle">
          <button
            className={`toggle-btn ${selectedMaterial === 'aluminum' ? 'active' : ''}`}
            onClick={() => setSelectedMaterial('aluminum')}
          >
            Aluminum
          </button>
          <button
            className={`toggle-btn ${selectedMaterial === 'pvc' ? 'active' : ''}`}
            onClick={() => setSelectedMaterial('pvc')}
          >
            PVC
          </button>
        </div>

        {activeForecast && (
          <ScenarioBuilder
            material={activeForecast.material}
            basePrice={activeForecast.current_price}
            unit={activeForecast.unit}
            forecastHorizon={activeForecast.forecast_horizon}
          />
        )}

        {!activeForecast && (
          <GlassCard>
            <p style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
              Loading forecast data...
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
