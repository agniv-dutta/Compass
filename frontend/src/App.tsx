import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { Forecasts } from './pages/Forecasts';
import { Performance } from './pages/Performance';
import { Scenarios } from './pages/Scenarios';
import { Settings } from './pages/Settings';
import { useAppRoute } from './hooks/useAppRoute';
import './styles/globals.css';
import './styles/theme.css';
import './styles/glassmorphism.css';

function App() {
  const { route, navigate } = useAppRoute();

  if (!route) {
    return <Landing onOpenWorkspace={() => navigate('dashboard')} />;
  }

  switch (route) {
    case 'forecasts': return <Forecasts />;
    case 'performance': return <Performance />;
    case 'scenarios': return <Scenarios />;
    case 'settings': return <Settings />;
    default: return <Dashboard />;
  }
}

export default App;
