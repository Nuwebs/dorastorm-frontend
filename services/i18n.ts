interface Locale {
  code: string;
  file: string;
  name: string;
}

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

export const STRATEGY: Strategy = 'prefix_and_default';

export const LOCALES: Locale[] = [
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

function getLocalesCodes(locales: Locale[]): string[] {
  return locales.reduce((acc: string[], locale: Locale) => {
    return [...acc, locale.code];
  }, []);
}

function getLocatedRoutes(
  strategy: Strategy,
  locales: Locale[],
  routes: string[],
  defaultLocale: string = DEFAULT_LOCALE
): string[] {
  if (locales.length < 1) {
    // eslint-disable-next-line no-console
    console.error('The locales array must have, at least, one locale object');
    return [];
  }
  const codes: string[] = getLocalesCodes(locales);
  const routesWithPrefix: string[] = [];
  if (!codes.includes(defaultLocale)) {
    // eslint-disable-next-line no-console
    console.error(
      'The selected default locale does not exist inside the provided locales array'
    );
    defaultLocale = locales[0].code;
  }
  if (strategy === 'no_prefix') {
    return routes;
  }
  routes.forEach((route) => {
    for (const code of codes) {
      if (code === DEFAULT_LOCALE && strategy === 'prefix_except_default') {
        continue;
      }
      routesWithPrefix.push(`/${code}${route}`);
    }
  });
  return [...routes, ...routesWithPrefix];
}

export const getLocatedRouteRules = (): RouteRule => {
  const routes = getLocatedRoutes(STRATEGY, LOCALES, SPA_ROUTES);
  const full: RouteRule = {};
  routes.forEach((route: string) => {
    full[route] = { ssr: false };
  });
  return full;
};
