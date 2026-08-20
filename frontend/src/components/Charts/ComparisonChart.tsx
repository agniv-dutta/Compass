import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MaterialForecast } from '../../services/types';

interface ComparisonChartProps {
  forecasts: MaterialForecast[];
}

const COLORS = ['#0f4c5c', '#d4af37'];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ forecasts }) => {
  const comparisonData = forecasts.map((f) => ({
    material: f.material.toUpperCase(),
    mape: f.accuracy_metrics.mape,
    directional: f.accuracy_metrics.directional_accuracy,
    confidence: f.accuracy_metrics.confidence,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.material}</p>
          <p style={{ color: payload[0].color }}>
            {payload[0].name}: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={comparisonData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a4f5e" />
        <XAxis dataKey="material" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="mape" name="MAPE %" radius={[8, 8, 0, 0]}>
          {comparisonData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
        <Bar
          dataKey="directional"
          fill="#0f4c5c"
          name="Directional Accuracy %"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
