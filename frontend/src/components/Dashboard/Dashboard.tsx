import React, { useEffect, useState } from 'react';
import { useForecastData } from '../../hooks/useForecastData';
import { apiClient } from '../../services/api';
import { ForecastCard } from './ForecastCard';
import { AlertBadge } from './AlertBadge';
import { Header } from '../Common/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { PriceChart } from '../Charts/PriceChart';
import { ComparisonChart } from '../Charts/ComparisonChart';
import { ProcurementPipeline } from '../Pipeline/Pipeline';
import { PriceAlertConfig } from '../PriceAlerts/PriceAlerts';
import { ExportPanel } from '../ExportPanel/ExportPanel';
import { MaterialComparison } from '../ComparisonView/MaterialComparison';
import { SkeletonLoader } from '../Common/SkeletonLoader';
import { Footer } from '../Common/Footer';
import type { BuySignal, ModelPerformance } from '../../services/types';
import '../Pipeline/Pipeline.css';
import '../PriceAlerts/PriceAlerts.css';
import '../ExportPanel/ExportPanel.css';
import '../ComparisonView/MaterialComparison.css';
import '../Charts/PriceChart.css';
import '../Common/SkeletonLoader.css';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { data: forecasts, loading, error } = useForecastData();
  const [buySignals, setBuySignals] = useState<BuySignal[]>([]);
  const [performance, setPerformance] = useState<ModelPerformance[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const signals = await apiClient.getBuySignals();
        setBuySignals(signals);

        const perf = await apiClient.getModelPerformance();
        setPerformance(perf);

        const alHist = await apiClient.getHistoricalData('aluminum');
        const pvcHist = await apiClient.getHistoricalData('pvc');
        setHistoricalData({ aluminum: alHist, pvc: pvcHist });

        setTimeout(() => setLoaded(true), 100);
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

        <div className={loaded ? 'fade-in' : ''}>
          <ProcurementPipeline />
        </div>

        <div className="dashboard-grid">
          <div className={`section-forecasts ${loaded ? 'fade-in' : ''}`} style={{ animationDelay: '100ms' }}>
            <h2 className="section-title">6-Month Price Forecasts</h2>

            {loading ? (
              <SkeletonLoader type="card" count={2} />
            ) : forecasts && Array.isArray(forecasts) ? (
              <div className="forecast-cards-container stagger-children">
                {forecasts.map((forecast) => (
                  <ForecastCard key={forecast.material} forecast={forecast} />
                ))}
              </div>
            ) : null}
          </div>

          <div className={`section-alerts ${loaded ? 'fade-in' : ''}`} style={{ animationDelay: '200ms' }}>
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
            <div style={{ marginTop: '24px' }}>
              <PriceAlertConfig
                currentPrice={{
                  aluminum: forecasts && Array.isArray(forecasts) ? forecasts[0]?.current_price || 0 : 0,
                  pvc: forecasts && Array.isArray(forecasts) ? forecasts[1]?.current_price || 0 : 0,
                }}
                unit={{
                  aluminum: '\u20B9',
                  pvc: '\u20B9',
                }}
              />
            </div>
          </div>

          <div className={`section-charts ${loaded ? 'fade-in' : ''}`} style={{ gridColumn: '1 / -1', animationDelay: '300ms' }}>
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

          <div className={`section-comparison ${loaded ? 'fade-in' : ''}`} style={{ gridColumn: '1 / -1', animationDelay: '400ms' }}>
            <h2 className="section-title">Forecast Comparison</h2>
            {forecasts && Array.isArray(forecasts) ? (
              <ComparisonChart forecasts={forecasts} />
            ) : null}
          </div>

          <div className={loaded ? 'fade-in' : ''} style={{ gridColumn: '1 / -1', animationDelay: '500ms' }}>
            <MaterialComparison />
          </div>

          <div className={loaded ? 'fade-in' : ''} style={{ gridColumn: '1 / -1', animationDelay: '600ms' }}>
            {forecasts && Array.isArray(forecasts) && buySignals.length > 0 && performance.length > 0 && (
              <ExportPanel
                forecasts={forecasts}
                signals={buySignals}
                performance={performance}
              />
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
