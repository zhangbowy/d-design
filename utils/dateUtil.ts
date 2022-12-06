import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * 格式化到 YYYY-MM-DD HH:mm:ss
 * @param date
 * @param format
 */
export function formatToDateTime(
  date: dayjs.ConfigType = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

/**
 * 格式化到 YYYY-MM-DD
 * @param date
 * @param format
 */
export function formatToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}


export const dateUtil = dayjs;
