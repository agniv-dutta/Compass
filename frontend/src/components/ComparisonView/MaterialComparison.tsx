import React, { useEffect, useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { GlassCard } from '../Common/GlassCard';
import { apiClient } from '../../services/api';
import type { MaterialForecast } from '../../services/types';
import './MaterialComparison.css';

export const MaterialComparison: React.FC = () => {
  const [forecasts, setForecasts] = useState<MaterialForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.getAllForecasts();
      setForecasts(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || forecasts.length < 2) {
    return (
      <GlassCard>
        <p style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
          Loading comparison data...
        </p>
      </GlassCard>
    );
  }

  const al = forecasts.find((f) => f.material === 'aluminum')!;
  const pvc = forecasts.find((f) => f.material === 'pvc')!;

  const alLast = al.forecast_horizon[al.forecast_horizon.length - 1];
  const pvcLast = pvc.forecast_horizon[pvc.forecast_horizon.length - 1];
  const alChange = ((alLast.predicted - al.current_price) / al.current_price) * 100;
  const pvcChange = ((pvcLast.predicted - pvc.current_price) / pvc.current_price) * 100;

  const radarData = [
    { metric: 'Accuracy', aluminum: 100 - al.accuracy_metrics.mape, pvc: 100 - pvc.accuracy_metrics.mape },
    { metric: 'Directional', aluminum: al.accuracy_metrics.directional_accuracy, pvc: pvc.accuracy_metrics.directional_accuracy },
    { metric: 'Confidence', aluminum: al.accuracy_metrics.confidence, pvc: pvc.accuracy_metrics.confidence },
    { metric: 'Price Stability', aluminum: Math.max(0, 100 - Math.abs(alChange) * 3), pvc: Math.max(0, 100 - Math.abs(pvcChange) * 3) },
    { metric: 'Data Coverage', aluminum: 85, pvc: 80 },
  ];

  const sideBySide = [
    {
      metric: 'Current Price',
      aluminum: `\u20B9${al.current_price.toLocaleString()}`,
      pvc: `\u20B9${pvc.current_price.toLocaleString()}`,
    },
    {
      metric: '6M Forecast',
      aluminum: `\u20B9${alLast.predicted.toFixed(0)}`,
      pvc: `\u20B9${pvcLast.predicted.toFixed(0)}`,
    },
    {
      metric: 'Expected Change',
      aluminum: `${alChange > 0 ? '+' : ''}${alChange.toFixed(2)}%`,
      pvc: `${pvcChange > 0 ? '+' : ''}${pvcChange.toFixed(2)}%`,
    },
    {
      metric: 'MAPE',
      aluminum: `${al.accuracy_metrics.mape}%`,
      pvc: `${pvc.accuracy_metrics.mape}%`,
    },
    {
      metric: 'Confidence',
      aluminum: `${al.accuracy_metrics.confidence}%`,
      pvc: `${pvc.accuracy_metrics.confidence}%`,
    },
  ];

  const priority = Math.abs(alChange) > Math.abs(pvcChange) ? 'aluminum' : 'pvc';
  const priorityMaterial = priority === 'aluminum' ? al : pvc;
  const priorityChange = priority === 'aluminum' ? alChange : pvcChange;

  const barData = [
    { name: 'ALUMINUM', change: alChange, fill: '#0f4c5c' },
    { name: 'PVC', change: pvcChange, fill: '#d4af37' },
  ];

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <p className="section-kicker">Analysis</p>
        <h3 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 600, color: '#f5f1e8' }}>
          Material Comparison
        </h3>
      </div>

      <div className="comparison-grid">
        <GlassCard>
          <div className="comparison-chart-card">
            <h4>Model Performance Radar</h4>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2d3142" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'Courier Prime, monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Aluminum" dataKey="aluminum" stroke="#0f4c5c" fill="#0f4c5c" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="PVC" dataKey="pvc" stroke="#d4af37" fill="#d4af37" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ background: '#202733', border: '1px solid #d4af37', borderRadius: 8, color: '#f5f1e8', fontFamily: 'Courier Prime, monospace', fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="radar-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#0f4c5c' }} /> Aluminum</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#d4af37' }} /> PVC</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="comparison-chart-card">
            <h4>6M Price Change Outlook</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontFamily: 'Courier Prime, monospace', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `${v}%`} style={{ fontFamily: 'Courier Prime, monospace', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#202733', border: '1px solid #d4af37', borderRadius: 8, color: '#f5f1e8', fontFamily: 'Courier Prime, monospace', fontSize: 12 }}
                  formatter={(value) => [`${Number(value) > 0 ? '+' : ''}${Number(value).toFixed(2)}%`, 'Change']}
                />
                <Bar dataKey="change" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.change > 0 ? '#ef4444' : '#57c5a5'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="comparison-table-section">
        <GlassCard>
          <div className="comparison-table-card">
            <h4>Side-by-Side Breakdown</h4>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="col-aluminum">Aluminum</th>
                  <th className="col-pvc">PVC</th>
                </tr>
              </thead>
              <tbody>
                {sideBySide.map((row) => (
                  <tr key={row.metric}>
                    <td className="metric-name">{row.metric}</td>
                    <td className="col-aluminum">{row.aluminum}</td>
                    <td className="col-pvc">{row.pvc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard elevated>
          <div className="priority-card">
            <p className="section-kicker">Recommendation</p>
            <h4 style={{ margin: '4px 0 12px', fontSize: '1rem', fontWeight: 600, color: '#f5f1e8' }}>
              Priority Material
            </h4>
            <div className="priority-material">
              <span className="priority-badge">{priority.toUpperCase()}</span>
              <span className="priority-change" style={{ color: priorityChange > 0 ? '#ef4444' : '#57c5a5' }}>
                {priorityChange > 0 ? '+' : ''}{priorityChange.toFixed(2)}% expected
              </span>
            </div>
            <p className="priority-reason">
              {priority === 'aluminum'
                ? 'Higher price volatility and larger expected move. Consider accelerating procurement timeline for aluminum to lock in current rates.'
                : 'Moderate price movement expected. Standard procurement cadence is sufficient. Monitor for further signals.'}
            </p>
            <div className="priority-data-sources">
              <span className="sources-label">Based on:</span>
              <span className="sources-value">{priorityMaterial.data_sources.slice(0, 3).join(', ')}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
