import { setLocale, defaultLocale } from 'yup';
import type { LocaleObject } from 'yup';
// Lang modules. These can't be async imported, so use it carefully.
import { es } from 'yup-locales';

interface SupportedLocales {
  [key: string]: LocaleObject;
}
// This had to be made because of this issue: https://github.com/jquense/yup/issues/1910
const DEFAULT = JSON.parse(JSON.stringify(defaultLocale));
const SUPPORTED_LOCALES: SupportedLocales = {
  es,
  en: DEFAULT
};

// TODO: Convert it to an util
const useValidationLocales = (locale: string) => {
  const check = locale in SUPPORTED_LOCALES;
  if (!check) {
    // eslint-disable-next-line no-console
    console.error('Yup locales composable does not support this locale');
    return;
  }
  setLocale(SUPPORTED_LOCALES[locale]);
};

export default useValidationLocales;
