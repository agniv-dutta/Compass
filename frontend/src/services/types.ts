export interface ForecastDataPoint {
  date: string;
  month: string;
  predicted: number;
  actual?: number;
  lower_bound: number;
  upper_bound: number;
}

export interface MaterialForecast {
  material: 'aluminum' | 'pvc';
  unit: string;
  current_price: number;
  forecast_horizon: ForecastDataPoint[];
  accuracy_metrics: {
    mape: number;
    directional_accuracy: number;
    confidence: number;
  };
  last_updated: string;
  data_sources: string[];
}

export interface BuySignal {
  material: 'aluminum' | 'pvc';
  status: 'buy' | 'hold' | 'wait';
  confidence: number;
  reasoning: string;
  estimated_savings: number;
  recommendation_date: string;
}

export interface HistoricalData {
  date: string;
  price: number;
  indicator_name: string;
  contribution: number;
}

export interface ModelPerformance {
  material: string;
  mape: number;
  directional_accuracy: number;
  max_error: number;
  rmse: number;
  backtesting_period: {
    start: string;
    end: string;
  };
}
