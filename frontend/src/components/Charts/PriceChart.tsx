import React from 'react';
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import type { MaterialForecast } from '../../services/types';

interface PriceChartProps {
  forecast: MaterialForecast;
  historical: any[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ forecast, historical }) => {
  const combinedData = [
    ...historical.map((h) => ({
      ...h,
      type: 'historical',
      actual: h.actual,
    })),
    ...forecast.forecast_horizon.map((f) => ({
      date: f.month,
      predicted: f.predicted,
      lower_bound: f.lower_bound,
      upper_bound: f.upper_bound,
      type: 'forecast',
    })),
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.date}</p>
          {data.actual && <p className="actual">Actual: {data.actual}</p>}
          {data.predicted && <p className="predicted">Forecast: {data.predicted}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={combinedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f4c5c" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0f4c5c" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#4a4f5e" />
        <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Area
          type="monotone"
          dataKey="upper_bound"
          fill="none"
          stroke="none"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="lower_bound"
          fill="url(#colorForecast)"
          stroke="none"
          isAnimationActive={false}
          name="Confidence Band"
        />

        <Line
          type="monotone"
          dataKey="actual"
          stroke="#0f4c5c"
          dot={false}
          strokeWidth={2}
          name="Historical"
          isAnimationActive={false}
        />

        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#d4af37"
          strokeWidth={2.5}
          dot={{ fill: '#d4af37', r: 4 }}
          name="Forecast"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
