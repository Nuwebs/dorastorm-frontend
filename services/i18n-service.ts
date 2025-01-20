/**
 * DEFINITIONS
 */
const I18N_STRATEGY = {
  NO_PREFIX: 'no_prefix',
  PREFIX_EXCEPT_DEFAULT: 'prefix_except_default',
  PREFIX: 'prefix',
  PREFIX_AND_DEFAULT: 'prefix_and_default'
} as const;

/**
 * Define here all the available locales in the app
 */
export const LOCALES = {
  en: {
    file: 'en.json',
    name: 'English'
  },
  es: {
    file: 'es.json',
    name: 'Español'
  },
  de: {
    file: 'de.json',
    name: 'Deutsch'
  }
} as const;

type I18nStrategy = (typeof I18N_STRATEGY)[keyof typeof I18N_STRATEGY];

export type LocaleCode = keyof typeof LOCALES;

export type Locale = {
  code: LocaleCode;
  file: (typeof LOCALES)[LocaleCode]['file'];
  name: (typeof LOCALES)[LocaleCode]['name'];
};

export const STRATEGY: I18nStrategy = I18N_STRATEGY.PREFIX_AND_DEFAULT;

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function availableLocales(): Locale[] {
  return Object.entries(LOCALES).map(([code, { file, name }]) => ({
    code: code as LocaleCode,
    file,
    name
  }));
}

/**
 * ZOD
 * DS4F uses Zod with the Nuxt ZodI18n module. It requires a map of the locales to the LocaleCode
 */
export const ZOD_LOCALES_MAP: { [key: string]: LocaleCode } = {
  'en-GB': 'en',
  'es-ES': 'es',
  'de-DE': 'de'
} as const;
