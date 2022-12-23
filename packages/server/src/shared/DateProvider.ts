import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const addDays = (days: number): Date => {
  return dayjs().add(days, 'days').toDate();
};
