import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { BuySignal } from '../services/types';

export const useAlerts = () => {
  const [signals, setSignals] = useState<BuySignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const data = await apiClient.getBuySignals();
        setSignals(data);
      } catch (err) {
        console.error('Failed to load alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  return { signals, loading };
};
