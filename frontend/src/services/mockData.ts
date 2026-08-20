import type { ForecastDataPoint, MaterialForecast, BuySignal, HistoricalData, ModelPerformance } from './types';

const generateDateRange = (months: number) => {
  const dates: { date: string; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    dates.push({
      date: d.toISOString().split('T')[0],
      month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
    });
  }
  return dates;
};

const generateForecast = (
  basePredicted: number,
  trend: number = 0.02,
  volatility: number = 0.05
): ForecastDataPoint[] => {
  const dates = generateDateRange(6);
  return dates.map((d, idx) => {
    const noise = (Math.random() - 0.5) * volatility * basePredicted;
    const predicted = basePredicted * Math.pow(1 + trend, idx) + noise;
    const confidence_interval = predicted * (0.05 + 0.02 * idx);

    return {
      date: d.date,
      month: d.month,
      predicted: Math.round(predicted * 100) / 100,
      lower_bound: Math.round((predicted - confidence_interval) * 100) / 100,
      upper_bound: Math.round((predicted + confidence_interval) * 100) / 100,
    };
  });
};

export const mockAluminumForecast: MaterialForecast = {
  material: 'aluminum',
  unit: '\u20B9/tonne',
  current_price: 2847,
  forecast_horizon: generateForecast(2847, 0.015, 0.08),
  accuracy_metrics: {
    mape: 8.3,
    directional_accuracy: 78,
    confidence: 92,
  },
  last_updated: new Date().toISOString(),
  data_sources: [
    'LME Aluminum Spot Price',
    'Brent Crude (WTI)',
    'USD/INR Exchange Rate',
    'Bauxite Import Pricing',
    'Energy Index',
  ],
};

export const mockPVCForecast: MaterialForecast = {
  material: 'pvc',
  unit: '\u20B9/kg',
  current_price: 64.2,
  forecast_horizon: generateForecast(64.2, 0.012, 0.07),
  accuracy_metrics: {
    mape: 11.2,
    directional_accuracy: 74,
    confidence: 88,
  },
  last_updated: new Date().toISOString(),
  data_sources: [
    'Ethylene Spot Price',
    'VCM (Vinyl Chloride Monomer)',
    'Naphtha Pricing',
    'Crude Oil (Brent)',
    'Freight Index',
  ],
};

export const mockBuySignals: BuySignal[] = [
  {
    material: 'aluminum',
    status: 'buy',
    confidence: 85,
    reasoning:
      'Model predicts 8-12% price increase next quarter. Current undervaluation suggests immediate procurement.',
    estimated_savings: 2400000,
    recommendation_date: new Date().toISOString(),
  },
  {
    material: 'pvc',
    status: 'hold',
    confidence: 72,
    reasoning:
      'Moderate upward trend expected. Hold current inventory; no urgency for additional purchase.',
    estimated_savings: 340000,
    recommendation_date: new Date().toISOString(),
  },
];

export const mockHistoricalData: HistoricalData[] = [
  { date: '2024-08', price: 2634, indicator_name: 'LME Aluminum', contribution: 0.45 },
  { date: '2024-07', price: 2598, indicator_name: 'Brent Crude', contribution: 0.28 },
  { date: '2024-06', price: 2547, indicator_name: 'USD/INR', contribution: 0.15 },
  { date: '2024-05', price: 2512, indicator_name: 'Energy Index', contribution: 0.12 },
  { date: '2024-04', price: 2489, indicator_name: 'Bauxite', contribution: 0.08 },
];

export const mockModelPerformance: ModelPerformance[] = [
  {
    material: 'aluminum',
    mape: 8.3,
    directional_accuracy: 78,
    max_error: 14,
    rmse: 156,
    backtesting_period: {
      start: '2020-01-01',
      end: '2024-08-31',
    },
  },
  {
    material: 'pvc',
    mape: 11.2,
    directional_accuracy: 74,
    max_error: 18,
    rmse: 4.2,
    backtesting_period: {
      start: '2020-01-01',
      end: '2024-08-31',
    },
  },
];

export const generateHistoricalPrices = (current: number, volatility: number = 0.08) => {
  const prices: { date: string; actual: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const noise = (Math.random() - 0.5) * volatility * current;
    const trend = (11 - i) * 0.01 * current;
    prices.push({
      date: d.toLocaleString('default', { month: 'short' }),
      actual:
        Math.round((current * (0.92 + Math.random() * 0.16) + noise + trend) * 100) / 100,
    });
  }
  return prices;
};

export const mockAluminumHistorical = generateHistoricalPrices(2847, 0.08);
export const mockPVCHistorical = generateHistoricalPrices(64.2, 0.07);
