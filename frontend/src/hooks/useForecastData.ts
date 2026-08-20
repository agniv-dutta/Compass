import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { MaterialForecast } from '../services/types';

export const useForecastData = (material?: 'aluminum' | 'pvc') => {
  const [data, setData] = useState<MaterialForecast | MaterialForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = material
          ? await apiClient.getForecast(material)
          : await apiClient.getAllForecasts();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch forecasts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [material]);

  return { data, loading, error };
};
