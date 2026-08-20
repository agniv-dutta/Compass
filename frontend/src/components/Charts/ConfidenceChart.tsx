import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ConfidenceChartProps {
  data: Array<{ name: string; importance: number }>;
}

export const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.importance - a.importance);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#4a4f5e" />
        <XAxis type="number" stroke="#9ca3af" />
        <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#2d3142',
            border: '1px solid #d4af37',
            borderRadius: '8px',
            color: '#f5f1e8',
          }}
        />
        <Bar dataKey="importance" fill="#d4af37" />
      </BarChart>
    </ResponsiveContainer>
  );
};
