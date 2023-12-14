export type locale = {
  code: string;
  file: string;
  name: string;
};

interface RouteRule {
  [key: string]: {
    ssr: boolean;
  };
}

type Strategy =
  | 'no_prefix'
  | 'prefix_except_default'
  | 'prefix'
  | 'prefix_and_default';

const SPA_ROUTES: string[] = ['/ds/**'];

export const DEFAULT_LOCALE: string = 'en';

// Currently using 'prefix' instead of 'prefix_and_default' because the later have too many bugs
// https://github.com/nuxt-modules/i18n/issues/1977
// https://github.com/nuxt-modules/i18n/issues/2131
// Own bug: Does not change the locale in the index guest page
export const STRATEGY: Strategy = 'prefix';

export const LOCALES: locale[] = [
  {
    code: 'en',
    file: 'en.json',
    name: 'English'
  },
  {
    code: 'es',
    file: 'es.json',
    name: 'Español'
  }
];

export const getLocalesCodes = (): string[] => {
  return LOCALES.reduce((acc: string[], locale: locale) => {
    return [...acc, locale.code];
  }, []);
};

export const getLocatedSPARoutes = (): string[] => {
  const codes: string[] = getLocalesCodes();
  const routesWithPrefix: string[] = [];
  if (STRATEGY === 'no_prefix') {
    return SPA_ROUTES;
  }
  SPA_ROUTES.forEach((route) => {
    for (const code of codes) {
      if (code === DEFAULT_LOCALE && STRATEGY === 'prefix_except_default') {
        continue;
      }
      routesWithPrefix.push(`/${code}${route}`);
    }
  });
  return [...SPA_ROUTES, ...routesWithPrefix];
};

export const getLocatedRouteRules = (): RouteRule => {
  const routes = getLocatedSPARoutes();
  const full: RouteRule = {};
  routes.forEach((route: string) => {
    full[route] = { ssr: false };
  });
  return full;
};
