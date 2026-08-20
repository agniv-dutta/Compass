import React from 'react';
import type { MaterialForecast } from '../../services/types';
import { GlassCard } from '../Common/GlassCard';
import { DeltaIndicator } from '../Common/DeltaIndicator';
import '../Common/DeltaIndicator.css';
import './Dashboard.css';

interface ForecastCardProps {
  forecast: MaterialForecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const firstForecast = forecast.forecast_horizon[0];
  const lastForecast = forecast.forecast_horizon[forecast.forecast_horizon.length - 1];
  const priceChange =
    ((lastForecast.predicted - forecast.current_price) / forecast.current_price) * 100;
  const isPositive = priceChange > 0;

  const threeMonthForecast = forecast.forecast_horizon[2];
  const momChange = threeMonthForecast
    ? ((threeMonthForecast.predicted - forecast.current_price) / forecast.current_price) * 100
    : 0;

  const qoqChange = priceChange;

  return (
    <GlassCard elevated accentBorder>
      <div className="forecast-card">
        <div className="card-header">
          <h3 className="material-name">{forecast.material.toUpperCase()}</h3>
          <span className="unit-badge">{forecast.unit}</span>
        </div>

        <div className="price-section">
          <div className="price-label">Current Price</div>
          <div className="price-value">
            {firstForecast?.date?.includes('\u20B9') ? '' : '\u20B9'}
            {forecast.current_price.toLocaleString()}
          </div>
          <div className="price-update">
            Last updated: {new Date(forecast.last_updated).toLocaleDateString()}
          </div>
        </div>

        <div className="delta-row">
          <DeltaIndicator
            value={momChange}
            label="3M Change"
            period="3M"
            size="sm"
            favorableDirection="down"
          />
          <DeltaIndicator
            value={qoqChange}
            label="6M Forecast"
            period="6M"
            size="sm"
            favorableDirection="down"
          />
        </div>

        <div className="forecast-summary">
          <div className="forecast-item">
            <span className="label">6M Forecast</span>
            <span className={`value ${isPositive ? 'positive' : 'negative'}`}>
              {firstForecast?.date?.includes('\u20B9') ? '' : '\u20B9'}
              {lastForecast.predicted.toLocaleString()}
            </span>
          </div>
          <div className="forecast-item">
            <span className="label">Expected Change</span>
            <span className={`value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metric">
            <span className="metric-label">Accuracy (MAPE)</span>
            <span className="metric-value">{forecast.accuracy_metrics.mape.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Directional</span>
            <span className="metric-value">
              {forecast.accuracy_metrics.directional_accuracy}%
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Confidence</span>
            <span className="metric-value">{forecast.accuracy_metrics.confidence}%</span>
          </div>
        </div>

        <div className="data-sources">
          <p className="sources-label">Data Sources:</p>
          <ul className="sources-list">
            {forecast.data_sources.slice(0, 3).map((source, idx) => (
              <li key={idx}>{source}</li>
            ))}
            {forecast.data_sources.length > 3 && (
              <li>+{forecast.data_sources.length - 3} more</li>
            )}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
};
