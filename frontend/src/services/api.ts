import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as mockData from './mockData';
import type { MaterialForecast, BuySignal, ModelPerformance } from './types';

class MockAPIClient {
  private client: AxiosInstance;
  private delay: number = 300;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    });

    this.client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
      return config;
    });

    this.client.interceptors.response.use((response: AxiosResponse) => {
      return response;
    });
  }

  async getForecast(material: 'aluminum' | 'pvc'): Promise<MaterialForecast> {
    return material === 'aluminum'
      ? mockData.mockAluminumForecast
      : mockData.mockPVCForecast;
  }

  async getAllForecasts(): Promise<MaterialForecast[]> {
    return [mockData.mockAluminumForecast, mockData.mockPVCForecast];
  }

  async getBuySignals(): Promise<BuySignal[]> {
    return mockData.mockBuySignals;
  }

  async getBuySignal(material: 'aluminum' | 'pvc'): Promise<BuySignal | null> {
    return mockData.mockBuySignals.find((s) => s.material === material) || null;
  }

  async getModelPerformance(): Promise<ModelPerformance[]> {
    return mockData.mockModelPerformance;
  }

  async getPerformance(material: 'aluminum' | 'pvc'): Promise<ModelPerformance | null> {
    return mockData.mockModelPerformance.find((p) => p.material === material) || null;
  }

  async getHistoricalData(material: 'aluminum' | 'pvc'): Promise<any[]> {
    return material === 'aluminum'
      ? mockData.mockAluminumHistorical
      : mockData.mockPVCHistorical;
  }

  async getFeatureImportance(_material: 'aluminum' | 'pvc'): Promise<any[]> {
    const features = [
      { name: 'LME Spot Price', importance: 0.45 },
      { name: 'Brent Crude', importance: 0.28 },
      { name: 'Exchange Rate', importance: 0.15 },
      { name: 'Energy Index', importance: 0.12 },
    ];
    return features;
  }

  async runScenario(
    material: string,
    assumptions: Record<string, number>
  ): Promise<any> {
    const basePrice = material === 'aluminum' ? 2847 : 64.2;
    const impact = Object.values(assumptions).reduce((a, b) => a + b, 0);
    return {
      scenario_name: 'Custom Analysis',
      material,
      projected_price: basePrice * (1 + impact),
      variance: impact * 100,
      confidence: 0.82,
    };
  }
}

export const apiClient = new MockAPIClient();

export const mockFetch = async (endpoint: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const routes: Record<string, any> = {
    '/forecasts': [mockData.mockAluminumForecast, mockData.mockPVCForecast],
    '/forecasts/aluminum': mockData.mockAluminumForecast,
    '/forecasts/pvc': mockData.mockPVCForecast,
    '/buy-signals': mockData.mockBuySignals,
    '/performance': mockData.mockModelPerformance,
  };

  return routes[endpoint] || null;
};
