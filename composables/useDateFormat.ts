import dayjs from "dayjs";

const DEFAULT_FORMAT: string = "YYYY/MM/DD";

const useDateFormat = () => {
  return (payload: string, format: string = DEFAULT_FORMAT): string => {
    return dayjs(payload).format(format);
  };
};

export default useDateFormat;
