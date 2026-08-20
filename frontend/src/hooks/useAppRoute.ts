import { useEffect, useState } from 'react';

export type AppRoute = 'dashboard' | 'forecasts' | 'performance' | 'scenarios' | 'settings';

const validRoutes: AppRoute[] = ['dashboard', 'forecasts', 'performance', 'scenarios', 'settings'];

const readRoute = (): AppRoute | null => {
  const route = window.location.hash.replace('#', '') as AppRoute;
  return validRoutes.includes(route) ? route : null;
};

export const useAppRoute = () => {
  const [route, setRoute] = useState<AppRoute | null>(readRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (nextRoute: AppRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
  };

  return { route, navigate };
};