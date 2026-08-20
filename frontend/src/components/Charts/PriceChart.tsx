import React, { useState, useMemo, useCallback } from 'react';
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
  Brush,
} from 'recharts';
import type { MaterialForecast } from '../../services/types';
import './PriceChart.css';

interface PriceChartProps {
  forecast: MaterialForecast;
  historical: any[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ forecast, historical }) => {
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100]);

  const combinedData = useMemo(() => {
    return [
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
  }, [historical, forecast]);

  const visibleData = useMemo(() => {
    const startIdx = Math.floor((zoomRange[0] / 100) * combinedData.length);
    const endIdx = Math.ceil((zoomRange[1] / 100) * combinedData.length);
    return combinedData.slice(startIdx, endIdx);
  }, [combinedData, zoomRange]);

  const handleZoomIn = useCallback(() => {
    setZoomRange((prev) => {
      const range = prev[1] - prev[0];
      const newRange = Math.max(20, range * 0.6);
      const center = (prev[0] + prev[1]) / 2;
      return [
        Math.max(0, center - newRange / 2),
        Math.min(100, center + newRange / 2),
      ];
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomRange((prev) => {
      const range = prev[1] - prev[0];
      const newRange = Math.min(100, range * 1.5);
      const center = (prev[0] + prev[1]) / 2;
      return [
        Math.max(0, center - newRange / 2),
        Math.min(100, center + newRange / 2),
      ];
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoomRange([0, 100]);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.date}</p>
          {data.actual && <p className="actual">Actual: {data.actual}</p>}
          {data.predicted && <p className="predicted">Forecast: {data.predicted.toFixed(2)}</p>}
          {data.lower_bound && data.upper_bound && (
            <p className="range">Range: {data.lower_bound.toFixed(0)} - {data.upper_bound.toFixed(0)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="price-chart-wrapper">
      <div className="chart-controls">
        <div className="zoom-buttons">
          <button className="zoom-btn" onClick={handleZoomIn} title="Zoom in">+</button>
          <button className="zoom-btn" onClick={handleZoomOut} title="Zoom out">-</button>
          <button className="zoom-btn reset" onClick={handleReset} title="Reset view">Reset</button>
        </div>
        <span className="zoom-indicator">
          Viewing {visibleData.length} of {combinedData.length} data points
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={visibleData}
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

          <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: 11, fontFamily: 'Courier Prime, monospace' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: 11, fontFamily: 'Courier Prime, monospace' }}
          />
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
            dot={{ fill: '#d4af37', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#d4af37', r: 6, stroke: '#202733', strokeWidth: 2 }}
            name="Forecast"
            isAnimationActive={false}
          />

          <Brush
            dataKey="date"
            height={30}
            stroke="#d4af37"
            fill="rgba(245, 241, 232, 0.04)"
            travellerWidth={8}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
