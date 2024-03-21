import dayjs, { Dayjs } from 'dayjs';

// TODO: Convert it to an util
export const DEFAULT_FORMAT: string = 'YYYY/MM/DD';

const useDateFormat = (
  payload: string | Date | Dayjs,
  format: string = DEFAULT_FORMAT
): string => {
  return dayjs(payload).format(format);
};

export default useDateFormat;
