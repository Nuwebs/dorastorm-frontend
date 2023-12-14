import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import en from 'dayjs/locale/en';
import es from 'dayjs/locale/es';
import { useI18n } from '#imports';
import { DEFAULT_LOCALE } from '~/services/i18n';

// Lang modules. These can't be async imported, so use it carefully.

interface SupportedLocales {
  [key: string]: ILocale;
}

const SUPPORTED_LOCALES: SupportedLocales = {
  en,
  es
};

const useRelativeTime = (baseDate?: string) => {
  const { locale } = useI18n();
  const check = locale.value in SUPPORTED_LOCALES;
  if (!check) {
    // eslint-disable-next-line no-console
    console.error('Relative time composable does not support this locale');
  }
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.extend(relativeTime);
  // eslint-disable-next-line import/no-named-as-default-member
  dayjs.locale(
    check ? SUPPORTED_LOCALES[locale.value] : SUPPORTED_LOCALES[DEFAULT_LOCALE]
  );
  const main = baseDate ? dayjs(baseDate) : dayjs();

  function fromNow (withoutSuffix: boolean = false) {
    return main.fromNow(withoutSuffix);
  }

  function toNow (withoutSuffix: boolean = false) {
    return main.toNow(withoutSuffix);
  }

  function from (comparedDate: string, withoutSuffix: boolean = false) {
    return main.from(dayjs(comparedDate), withoutSuffix);
  }

  function to (comparedDate: string, withoutSuffix: boolean = false) {
    return main.to(dayjs(comparedDate), withoutSuffix);
  }

  return {
    fromNow,
    toNow,
    from,
    to
  };
};

export default useRelativeTime;
