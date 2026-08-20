import React, { useEffect, useState } from 'react';
import { useForecastData } from '../../hooks/useForecastData';
import { apiClient } from '../../services/api';
import { ForecastCard } from './ForecastCard';
import { AlertBadge } from './AlertBadge';
import { Header } from '../Common/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { PriceChart } from '../Charts/PriceChart';
import { ComparisonChart } from '../Charts/ComparisonChart';
import { Footer } from '../Common/Footer';
import './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { data: forecasts, loading, error } = useForecastData();
  const [buySignals, setBuySignals] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const signals = await apiClient.getBuySignals();
        setBuySignals(signals);

        const alHist = await apiClient.getHistoricalData('aluminum');
        const pvcHist = await apiClient.getHistoricalData('pvc');
        setHistoricalData({ aluminum: alHist, pvc: pvcHist });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Header title="Forecast Dashboard" subtitle="Smart Buy - Price Intelligence" />

        {error && (
          <div className="error-banner">
            <p>Error loading data: {error}</p>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="section-forecasts">
            <h2 className="section-title">6-Month Price Forecasts</h2>

            {loading ? (
              <p className="loading-text">Loading forecasts...</p>
            ) : forecasts && Array.isArray(forecasts) ? (
              <div className="forecast-cards-container">
                {forecasts.map((forecast) => (
                  <ForecastCard key={forecast.material} forecast={forecast} />
                ))}
              </div>
            ) : null}
          </div>

          <div className="section-alerts">
            <h2 className="section-title">Buy Signals & Alerts</h2>
            <div className="alerts-container">
              {buySignals.length > 0 ? (
                buySignals.map((signal, idx) => (
                  <AlertBadge key={idx} signal={signal} />
                ))
              ) : (
                <p className="empty-state">No active signals</p>
              )}
            </div>
          </div>

          <div className="section-charts" style={{ gridColumn: '1 / -1' }}>
            <h2 className="section-title">Historical vs Forecast</h2>

            {historicalData && Object.keys(historicalData).length > 0 && forecasts && Array.isArray(forecasts) ? (
              <div className="charts-grid">
                {forecasts.map((forecast) => (
                  <div key={forecast.material} className="chart-container">
                    <h3>{forecast.material.toUpperCase()}</h3>
                    <PriceChart
                      forecast={forecast}
                      historical={historicalData[forecast.material] || []}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="section-comparison" style={{ gridColumn: '1 / -1' }}>
            <h2 className="section-title">Forecast Comparison</h2>
            {forecasts && Array.isArray(forecasts) ? (
              <ComparisonChart forecasts={forecasts} />
            ) : null}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
