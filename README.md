# Smart Buy - AI-Powered Raw Material Price Intelligence

A React + TypeScript frontend prototype for **Smart Buy**, an AI-based raw material price prediction system. Provides 6-month forecasts for aluminum and PVC with buy/hold signals, historical overlays, and model performance analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS 3 + custom CSS (glassmorphism) |
| Charts | Recharts |
| HTTP Client | Axios (mock interceptors) |
| State | React Context / Hooks |

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Common/          # Header, Footer, MetricBox, GlassCard
│   │   ├── Charts/          # PriceChart, ComparisonChart, ConfidenceChart
│   │   ├── Dashboard/       # Dashboard, ForecastCard, AlertBadge
│   │   └── Sidebar/         # Sidebar navigation
│   ├── hooks/               # useForecastData, useChartData, useAlerts
│   ├── pages/               # Dashboard, Forecasts, Performance, Settings
│   ├── services/            # types.ts, mockData.ts, api.ts (mock API)
│   ├── styles/              # theme.css, globals.css, glassmorphism.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── .env
└── .env.example
```

## Design Theme

Dark-mode analytical aesthetic with:

- **Primary:** Deep charcoal `#1a1f2e` with amber/gold accents `#d4af37`
- **Secondary:** Deep teal `#0f4c5c` for data zones and charts
- **Accent:** Copper/rust `#b87333` for insights and callouts
- **Text:** Off-white `#f5f1e8` on dark backgrounds
- **Charts:** Gradient from teal to gold for forecasting momentum
- **Typography:** Inter / Space Grotesk (headers), Lora (body), Courier Prime (data callouts)
- **Effects:** Glassmorphism panels, gradient accent lines, layered transparency

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

Output in `dist/`.

## Features

- **6-Month Price Forecasts** - Aluminum (Rs/tonne) and PVC (Rs/kg) with confidence bands
- **Buy/Hold/Wait Signals** - AI-generated procurement recommendations with estimated savings
- **Historical vs Forecast Charts** - Line charts overlaying actual and predicted prices
- **Model Performance** - MAPE, directional accuracy, RMSE, and backtesting metrics
- **Feature Importance** - Horizontal bar chart showing indicator contributions
- **Sidebar Navigation** - Sticky sidebar with active state indicators and live feed status
- **Responsive Layout** - Grid adapts across desktop, tablet, and mobile

## Mock API

All data is simulated with a 300ms latency delay. No backend required.

| Endpoint | Description |
|----------|-------------|
| `getForecast(material)` | Aluminum or PVC forecast data |
| `getAllForecasts()` | Both material forecasts |
| `getBuySignals()` | Buy/hold/wait recommendations |
| `getModelPerformance()` | Backtesting metrics |
| `getHistoricalData(material)` | 12-month price history |
| `getFeatureImportance(material)` | SHAP-style feature contributions |
| `runScenario(material, assumptions)` | What-if analysis |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001` | Backend API base URL |
| `VITE_THEME_MODE` | `dark` | Theme mode |
| `VITE_APP_ENV` | `development` | Application environment |

## Backend Integration (Phase 2)

To swap mock data for real API:

1. Replace `mockData.ts` imports in `api.ts` with actual HTTP calls
2. Update `apiClient` methods to hit real endpoints
3. Add authentication layer (JWT tokens)
4. Add WebSocket for live data updates
5. Implement CSV/PDF export

## License

Private - All rights reserved.
