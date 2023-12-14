import dayjs, { Dayjs } from 'dayjs';

export const DEFAULT_FORMAT: string = 'YYYY/MM/DD';

const useDateFormat = (payload: string | Date | Dayjs, format: string = DEFAULT_FORMAT): string => {
  return dayjs(payload).format(format);
};

export default useDateFormat;
