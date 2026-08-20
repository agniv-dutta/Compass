import React from 'react';
import { Header } from '../components/Common/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { useForecastData } from '../hooks/useForecastData';
import { ForecastCard } from '../components/Dashboard/ForecastCard';

export const Forecasts: React.FC = () => {
  const { data: forecasts, loading, error } = useForecastData();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Detailed Forecasts" subtitle="In-depth material price predictions" />

        {error && (
          <div className="error-banner">
            <p>Error loading data: {error}</p>
          </div>
        )}

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
    </div>
  );
};
