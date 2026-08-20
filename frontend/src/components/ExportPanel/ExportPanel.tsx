import React, { useState } from 'react';
import type { MaterialForecast, BuySignal, ModelPerformance } from '../../services/types';
import { GlassCard } from '../Common/GlassCard';
import './ExportPanel.css';

interface ExportPanelProps {
  forecasts: MaterialForecast[];
  signals: BuySignal[];
  performance: ModelPerformance[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ forecasts, signals, performance }) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportCSV = (type: 'forecasts' | 'signals' | 'performance') => {
    setExporting(type);

    let csv = '';
    let filename = '';

    if (type === 'forecasts') {
      csv = 'Material,Unit,Current Price,6M Forecast,Change %,MAPE,Directional Accuracy,Confidence\n';
      forecasts.forEach((f) => {
        const last = f.forecast_horizon[f.forecast_horizon.length - 1];
        const change = ((last.predicted - f.current_price) / f.current_price * 100).toFixed(2);
        csv += `${f.material.toUpperCase()},${f.unit},${f.current_price},${last.predicted.toFixed(2)},${change},${f.accuracy_metrics.mape},${f.accuracy_metrics.directional_accuracy},${f.accuracy_metrics.confidence}\n`;
      });
      filename = 'smart-buy-forecasts.csv';
    } else if (type === 'signals') {
      csv = 'Material,Status,Confidence,Estimated Savings,Reasoning\n';
      signals.forEach((s) => {
        csv += `${s.material.toUpperCase()},${s.status},${s.confidence},${s.estimated_savings},"${s.reasoning}"\n`;
      });
      filename = 'smart-buy-signals.csv';
    } else {
      csv = 'Material,MAPE,Directional Accuracy,Max Error,RMSE,Backtest Start,Backtest End\n';
      performance.forEach((p) => {
        csv += `${p.material.toUpperCase()},${p.mape},${p.directional_accuracy},${p.max_error},${p.rmse},${p.backtesting_period.start},${p.backtesting_period.end}\n`;
      });
      filename = 'smart-buy-performance.csv';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(null), 500);
  };

  const exportPDF = () => {
    setExporting('pdf');

    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-buy-report.html';
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(null), 500);
  };

  const generatePDFContent = (): string => {
    const now = new Date().toLocaleString();
    let html = `<!DOCTYPE html>
<html><head><title>Smart Buy Report - ${now}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; background: #1a1f2e; color: #f5f1e8; padding: 40px; }
  h1 { color: #d4af37; border-bottom: 2px solid #0f4c5c; padding-bottom: 10px; }
  h2 { color: #d4af37; margin-top: 30px; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th { background: #2d3142; color: #d4af37; padding: 10px; text-align: left; font-size: 0.85rem; }
  td { padding: 8px 10px; border-bottom: 1px solid #2d3142; font-size: 0.85rem; }
  .positive { color: #10b981; }
  .negative { color: #ef4444; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
  .badge-buy { background: rgba(16, 185, 129, 0.2); color: #10b981; }
  .badge-hold { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
  .meta { color: #9ca3af; font-size: 0.8rem; margin-top: 40px; }
</style></head><body>
<h1>Smart Buy - Forecast Report</h1>
<p style="color:#9ca3af">Generated: ${now}</p>`;

    html += `<h2>Price Forecasts</h2>
<table><tr><th>Material</th><th>Current</th><th>6M Forecast</th><th>Change</th><th>MAPE</th><th>Confidence</th></tr>`;
    forecasts.forEach((f) => {
      const last = f.forecast_horizon[f.forecast_horizon.length - 1];
      const change = ((last.predicted - f.current_price) / f.current_price * 100);
      const cls = change > 0 ? 'negative' : 'positive';
      html += `<tr><td>${f.material.toUpperCase()}</td><td>${f.unit}${f.current_price.toLocaleString()}</td><td>${f.unit}${last.predicted.toFixed(2)}</td><td class="${cls}">${change > 0 ? '+' : ''}${change.toFixed(2)}%</td><td>${f.accuracy_metrics.mape}%</td><td>${f.accuracy_metrics.confidence}%</td></tr>`;
    });
    html += `</table>`;

    html += `<h2>Buy Signals</h2>
<table><tr><th>Material</th><th>Status</th><th>Confidence</th><th>Savings</th><th>Reasoning</th></tr>`;
    signals.forEach((s) => {
      html += `<tr><td>${s.material.toUpperCase()}</td><td><span class="badge badge-${s.status}">${s.status.toUpperCase()}</span></td><td>${s.confidence}%</td><td>\u20B9${(s.estimated_savings / 100000).toFixed(1)}L</td><td>${s.reasoning}</td></tr>`;
    });
    html += `</table>`;

    html += `<h2>Model Performance</h2>
<table><tr><th>Material</th><th>MAPE</th><th>Directional Acc.</th><th>RMSE</th><th>Max Error</th></tr>`;
    performance.forEach((p) => {
      html += `<tr><td>${p.material.toUpperCase()}</td><td>${p.mape}%</td><td>${p.directional_accuracy}%</td><td>${p.rmse}</td><td>${p.max_error}</td></tr>`;
    });
    html += `</table>`;

    html += `<p class="meta">Smart Buy - AI-Powered Raw Material Price Intelligence</p></body></html>`;
    return html;
  };

  return (
    <GlassCard>
      <div className="export-panel">
        <div className="export-header">
          <p className="section-kicker">Export</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 600, color: '#f5f1e8' }}>
            Download Reports
          </h3>
        </div>

        <div className="export-buttons">
          <button
            className={`export-btn csv ${exporting === 'forecasts' ? 'exporting' : ''}`}
            onClick={() => exportCSV('forecasts')}
            disabled={!!exporting}
          >
            <div className="export-btn-text">
              <span className="export-btn-label">Forecasts CSV</span>
              <span className="export-btn-hint">Price predictions & accuracy</span>
            </div>
          </button>

          <button
            className={`export-btn csv ${exporting === 'signals' ? 'exporting' : ''}`}
            onClick={() => exportCSV('signals')}
            disabled={!!exporting}
          >
            <div className="export-btn-text">
              <span className="export-btn-label">Signals CSV</span>
              <span className="export-btn-hint">Buy/hold recommendations</span>
            </div>
          </button>

          <button
            className={`export-btn csv ${exporting === 'performance' ? 'exporting' : ''}`}
            onClick={() => exportCSV('performance')}
            disabled={!!exporting}
          >
            <div className="export-btn-text">
              <span className="export-btn-label">Performance CSV</span>
              <span className="export-btn-hint">Backtesting metrics</span>
            </div>
          </button>

          <button
            className={`export-btn pdf ${exporting === 'pdf' ? 'exporting' : ''}`}
            onClick={exportPDF}
            disabled={!!exporting}
          >
            <div className="export-btn-text">
              <span className="export-btn-label">Full Report (HTML)</span>
              <span className="export-btn-hint">All data in one file</span>
            </div>
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
