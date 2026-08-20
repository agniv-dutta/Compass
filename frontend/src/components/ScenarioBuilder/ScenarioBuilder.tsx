import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlassCard } from '../Common/GlassCard';

interface ScenarioParams {
  lmeChange: number;
  crudeChange: number;
  exchangeRateChange: number;
  energyIndexChange: number;
  demandShift: number;
}

interface ScenarioBuilderProps {
  material: 'aluminum' | 'pvc';
  basePrice: number;
  unit: string;
  forecastHorizon: Array<{ month: string; predicted: number; lower_bound: number; upper_bound: number }>;
}

const INDICATORS: { key: keyof ScenarioParams; label: string; min: number; max: number; step: number; icon: string }[] = [
  { key: 'lmeChange', label: 'LME Spot Price', min: -30, max: 30, step: 0.5, icon: '\u25B2' },
  { key: 'crudeChange', label: 'Brent Crude', min: -40, max: 40, step: 0.5, icon: '\u25CF' },
  { key: 'exchangeRateChange', label: 'USD/INR', min: -15, max: 15, step: 0.25, icon: '\u00A4' },
  { key: 'energyIndexChange', label: 'Energy Index', min: -25, max: 25, step: 0.5, icon: '\u26A1' },
  { key: 'demandShift', label: 'Demand Shift', min: -20, max: 20, step: 0.5, icon: '\u2195' },
];

const DEFAULT_PARAMS: ScenarioParams = {
  lmeChange: 0,
  crudeChange: 0,
  exchangeRateChange: 0,
  energyIndexChange: 0,
  demandShift: 0,
};

const WEIGHTS: Record<string, Record<keyof ScenarioParams, number>> = {
  aluminum: { lmeChange: 0.45, crudeChange: 0.20, exchangeRateChange: 0.15, energyIndexChange: 0.12, demandShift: 0.08 },
  pvc: { lmeChange: 0.10, crudeChange: 0.30, exchangeRateChange: 0.12, energyIndexChange: 0.18, demandShift: 0.30 },
};

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ material, basePrice, unit, forecastHorizon }) => {
  const [params, setParams] = useState<ScenarioParams>(DEFAULT_PARAMS);

  const weights = WEIGHTS[material];

  const totalImpact = useMemo(() => {
    return Object.entries(params).reduce((sum, [key, val]) => {
      return sum + (val * (weights[key as keyof ScenarioParams] || 0));
    }, 0);
  }, [params, weights]);

  const projectedPrice = basePrice * (1 + totalImpact / 100);

  const scenarioData = useMemo(() => {
    return forecastHorizon.map((point, idx) => {
      const monthImpact = totalImpact * ((idx + 1) / forecastHorizon.length);
      const projected = basePrice * (1 + monthImpact / 100);
      const spread = projected * (0.03 + 0.015 * idx);
      return {
        month: point.month,
        baseline: point.predicted,
        scenario: Math.round(projected * 100) / 100,
        upper: Math.round((projected + spread) * 100) / 100,
        lower: Math.round((projected - spread) * 100) / 100,
      };
    });
  }, [forecastHorizon, basePrice, totalImpact]);

  const resetParams = () => setParams(DEFAULT_PARAMS);

  const impactColor = totalImpact > 0 ? '#ef4444' : totalImpact < 0 ? '#57c5a5' : '#f5f1e8';

  return (
    <div className="scenario-builder">
      <div className="scenario-controls">
        <GlassCard elevated>
          <div className="scenario-panel">
            <div className="scenario-panel-header">
              <div>
                <p className="section-kicker">What-If Analysis</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 600, color: '#f5f1e8' }}>
                  Scenario Builder
                </h3>
              </div>
              <button className="scenario-reset-btn" onClick={resetParams}>
                Reset
              </button>
            </div>

            <div className="slider-group">
              {INDICATORS.map((ind) => (
                <div key={ind.key} className="slider-row">
                  <div className="slider-label-row">
                    <span className="slider-icon">{ind.icon}</span>
                    <span className="slider-label">{ind.label}</span>
                    <span
                      className="slider-value"
                      style={{ color: params[ind.key] > 0 ? '#ef4444' : params[ind.key] < 0 ? '#57c5a5' : '#9ca3af' }}
                    >
                      {params[ind.key] > 0 ? '+' : ''}{params[ind.key].toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ind.min}
                    max={ind.max}
                    step={ind.step}
                    value={params[ind.key]}
                    onChange={(e) => setParams((prev) => ({ ...prev, [ind.key]: parseFloat(e.target.value) }))}
                    className="scenario-slider"
                    style={{
                      background: `linear-gradient(90deg, #0f4c5c 0%, #0f4c5c ${((params[ind.key] - ind.min) / (ind.max - ind.min)) * 100}%, #2d3142 ${((params[ind.key] - ind.min) / (ind.max - ind.min)) * 100}%, #2d3142 100%)`,
                    }}
                  />
                  <div className="slider-range-labels">
                    <span>{ind.min}%</span>
                    <span>{ind.max}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="scenario-result">
              <div className="result-row">
                <span className="result-label">Projected Price</span>
                <span className="result-price" style={{ color: impactColor }}>
                  {unit}{projectedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Net Impact</span>
                <span className="result-impact" style={{ color: impactColor }}>
                  {totalImpact > 0 ? '+' : ''}{totalImpact.toFixed(2)}%
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Confidence</span>
                <span className="result-confidence">
                  {Math.max(40, Math.round(85 - Math.abs(totalImpact) * 0.8))}%
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="scenario-chart">
        <GlassCard>
          <div style={{ padding: '4px 0' }}>
            <p className="section-kicker">Price Projection</p>
            <h3 style={{ margin: '4px 0 16px', fontSize: '1rem', fontWeight: 600, color: '#f5f1e8' }}>
              Baseline vs Scenario
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={scenarioData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="scenarioBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={impactColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={impactColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 11, fontFamily: 'Courier Prime, monospace' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: 11, fontFamily: 'Courier Prime, monospace' }} />
                <Tooltip
                  contentStyle={{ background: '#202733', border: '1px solid #d4af37', borderRadius: 8, color: '#f5f1e8', fontFamily: 'Courier Prime, monospace', fontSize: 12 }}
                  formatter={(value, name) => [`${unit}${Number(value).toLocaleString()}`, String(name)]}
                />
                <Area type="monotone" dataKey="upper" fill="none" stroke="none" isAnimationActive={false} />
                <Area type="monotone" dataKey="lower" fill="url(#scenarioBand)" stroke="none" isAnimationActive={false} name="Scenario Range" />
                <Line type="monotone" dataKey="baseline" stroke="#6b7280" strokeWidth={2} dot={false} strokeDasharray="6 4" name="Baseline" isAnimationActive={false} />
                <Line type="monotone" dataKey="scenario" stroke={impactColor} strokeWidth={2.5} dot={{ fill: impactColor, r: 3 }} name="Scenario" isAnimationActive={false} />
                <ReferenceLine y={basePrice} stroke="#d4af37" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Current', fill: '#d4af37', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
