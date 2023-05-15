import dayjs from "dayjs";

const DEFAULT_FORMAT: string = "YYYY/MM/DD";

export default function useDateFormat() {
  return (payload: string, format: string = DEFAULT_FORMAT): string => {
    return dayjs(payload).format(format);
  };
}
