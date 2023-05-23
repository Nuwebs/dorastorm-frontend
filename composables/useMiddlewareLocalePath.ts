import { DEFAULT_LOCALE } from "~/services/i18n";
const useMiddlwareLocalePath = (
  routeName: string,
  nameDelimiter: string = "___"
) => {
  function actualLocale(): string {
    const words = routeName.split(nameDelimiter);
    const locale = words.pop();
    if (!locale) return "";
    return locale;
  }

  function getPath(route: string) {
    route = route[0] === "/" ? route : "/" + route;
    const locale = actualLocale();
    const check = locale === DEFAULT_LOCALE || locale === "default";
    return check ? route : "/" + locale + route;
  }

  return getPath;
};

export default useMiddlwareLocalePath;
