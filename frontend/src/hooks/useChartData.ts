import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export const useChartData = (material: 'aluminum' | 'pvc') => {
  const [historical, setHistorical] = useState<any[]>([]);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [histData, features] = await Promise.all([
          apiClient.getHistoricalData(material),
          apiClient.getFeatureImportance(material),
        ]);
        setHistorical(histData);
        setFeatureImportance(features);
      } catch (err) {
        console.error('Failed to load chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [material]);

  return { historical, featureImportance, loading };
};
