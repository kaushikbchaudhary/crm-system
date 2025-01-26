import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  differenceInSeconds,
  endOfDay,
  getMonth,
  getTime,
  getYear,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isValid,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
  subSeconds,
} from 'date-fns';
import {format} from 'date-fns';
import { intervalToDuration } from 'date-fns/fp';
import {parse} from 'date-fns';

export const getAge = (dateOfBirth: string | Date, needPrefix: boolean = true, endDate?: Date) => {
  const { years, months, days, hours } = intervalToDuration({
    start: dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth),
    end: endDate ? endDate : new Date(),
  });
  let age: string = '';
  if (years === 0) {
    if (months === 0) {
      if (days === 0) {
        age = hours + (needPrefix ? ' Hrs' : '');
      } else {
        age = days + (needPrefix ? ' D' : '');
      }
    } else {
      age = months + (needPrefix ? ' M' : '');
    }
  } else {
    age = years + (needPrefix ? ' Yrs' : '');
  }
  return age;
};

export function parseDate(dateTime: string, format?: string) {
  return format ? parse(dateTime, format, new Date()) : new Date(dateTime);
}

export function getMilli(dateTime: string | Date, format?: string) {
  if (dateTime instanceof Date) {
    return getTime(dateTime);
  }
  return getTime(parseDate(dateTime, format));
}

export const formatDateTime = (dateTime: Date | string, targetFormat: string, sourceFormat?: string) => {
  if (dateTime instanceof Date) {
    return format(dateTime, targetFormat);
  }
  // return format(parseDate(dateTime, sourceFormat), targetFormat);
  // Parse string to date, if source format is provided
  const parsedDate = sourceFormat ? parse(dateTime, sourceFormat, new Date()) : new Date(dateTime);

  // Check if parsed date is valid
  if (!isValid(parsedDate)) {
    console.warn(`Invalid date format: ${dateTime}`);
    return ''; // or any fallback you want, e.g., 'Invalid Date'
  }

  return format(parsedDate, targetFormat);
};

export const isDateTimeAfter = (time1: Date | string, time2: Date | string, format?: string) => {
  if (time1 instanceof Date && time2 instanceof Date) {
    return isAfter(time1, time2);
  }
  return isAfter(parseDate(time1 as string, format), parseDate(time2 as string, format));
};
export const isDateTimeBefore = (time1: Date | string, time2: Date | string, format?: string) => {
  if (time1 instanceof Date && time2 instanceof Date) {
    return isBefore(time1, time2);
  }
  return isBefore(parseDate(time1 as string, format), parseDate(time2 as string, format));
};
export const isDateTimeSame = (time1: Date | string, time2: Date | string, format?: string) => {
  if (time1 instanceof Date && time2 instanceof Date) {
    return isEqual(time1, time2);
  }
  return isEqual(parseDate(time1 as string, format), parseDate(time2 as string, format));
};

export const isDateTimeSameOrAfter = (time1: Date | string, time2: Date | string, format?: string) => {
  return isDateTimeSame(time1, time2, format) || isDateTimeAfter(time1, time2, format) ? true : false;
};
export const isDateTimeSameOrBefore = (time1: Date | string, time2: Date | string, format?: string) => {
  return isDateTimeSame(time1, time2, format) || isDateTimeBefore(time1, time2, format) ? true : false;
};

export const isDateTimeBetween = (date: Date, startDate: Date, endDate: Date) => {
  return isDateTimeSameOrAfter(date, startDate) && isDateTimeSameOrBefore(date, endDate);
};

export const isEqualDay = (time1: Date, time2: Date) => {
  return isSameDay(time1, time2);
};

export const addDaysInDateTime = (dateTime: Date | string, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return addDays(dateTime, amount);
  }
  return addDays(parseDate(dateTime, format), amount);
};

export const addHoursInDateTime = (dateTime: string | Date, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return addHours(dateTime, amount);
  }
  return addHours(parseDate(dateTime, format), amount);
};
export const subtractHoursFromDateTime = (dateTime: string | Date, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return subHours(dateTime, amount);
  }
  return subHours(parseDate(dateTime, format), amount);
};

export const addMinutesInDateTime = (dateTime: Date | string, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return addMinutes(dateTime, amount);
  }
  return addMinutes(parseDate(dateTime, format), amount);
};
export const addSecondsInDateTime = (dateTime: Date | string, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return addSeconds(dateTime, amount);
  }
  return addSeconds(parseDate(dateTime, format), amount);
};
export const subtractSecondsFromDateTime = (dateTime: Date | string, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return subSeconds(dateTime, amount);
  }
  return subSeconds(parseDate(dateTime, format), amount);
};

export const subtractMinutesFromDateTime = (dateTime: Date | string, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return subMinutes(dateTime, amount);
  }
  return subMinutes(parseDate(dateTime, format), amount);
};

export const subtractDaysFromDate = (dateTime: string | Date, amount: number, format?: string) => {
  if (dateTime instanceof Date) {
    return subDays(dateTime, amount);
  }
  return subDays(parseDate(dateTime, format), amount);
};

export const startOfProvidedDay = (date: Date | string, format?: string) => {
  if (date instanceof Date) {
    return startOfDay(date);
  }
  return startOfDay(parseDate(date, format));
};

export const endOfProvidedDay = (date: Date | string, format?: string) => {
  if (date instanceof Date) {
    return endOfDay(date);
  }
  return endOfDay(parseDate(date, format));
};

export const getDateMonth = (date: string, format: string) => {
  return getMonth(parseDate(date, format));
};

export const getDateYear = (date: string, format: string) => {
  return getYear(parseDate(date, format));
};

export const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
  let now = startDate;
  const dates = [];
  const then = endDate;
  while (isDateTimeSameOrBefore(now, then)) {
    dates.push(startOfProvidedDay(now).getTime());
    now = addDaysInDateTime(now, 1);
  }
  return dates;
};

export const isDateValid = (date: Date | string, format?: string) => {
  if (date instanceof Date) {
    return isValid(date);
  }
  return isValid(parseDate(date, format));
};
export function subtractYears(numOfYears: number, date: Date) {
  const dateCopy = new Date(date.getTime());

  dateCopy.setFullYear(dateCopy.getFullYear() - numOfYears);

  return dateCopy;
}

export const getDifferenceInSeconds = (dateAfter: Date | string, dateBefore: Date | string, format?: string) => {
  if (dateAfter instanceof Date && dateBefore instanceof Date) {
    return differenceInSeconds(dateAfter, dateBefore);
  }
  return differenceInSeconds(parseDate(dateAfter as string, format), parseDate(dateBefore as string, format));
};

export const validateDateOnFly = (date: string) => {
  if (date) {
    const trimDate = date.split('/');
    const day = trimDate[0];
    const month = trimDate[1];
    const year = trimDate[2];
    if (day?.length === 2 && month?.length === 2 && year?.length === 4) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getDateInterval = (startDate: string | Date, endDate: string | Date, needPrefix = true) => {
  const { years, months, days } = intervalToDuration({
    start: startDate instanceof Date ? startDate : new Date(startDate),
    end: endDate instanceof Date ? endDate : new Date(endDate),
  });
  let age = '';
  if (years === 0) {
    if (months === 0) {
      age = days + (needPrefix ? ' D' : '');
    } else {
      age = months + (needPrefix ? ' M' : '');
    }
  } else {
    age = years + (needPrefix ? ' Y' : '');
  }
  return age;
};

export const getDuration = (endDate: string | Date, startDate: string | Date, needPrefix: boolean = true) => {
  const { days, hours, minutes, seconds } = intervalToDuration({
    start: endDate instanceof Date ? endDate : new Date(endDate),
    end: startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : new Date(),
  });
  let str: string = '';

  if (days) {
    str = `${str ? `${str} ` : ''}${days}${needPrefix ? 'd' : ''}`;
  }
  if (hours) {
    str = `${str ? `${str} ` : ''}${hours}${needPrefix ? 'h' : ''}`;
  }
  if (minutes) {
    str = `${str ? `${str} ` : ''}${minutes}${needPrefix ? 'm' : ''}`;
  }
  if (((!hours && minutes) || !minutes) && seconds) {
    str = `${str ? `${str} ` : ''}${seconds}${needPrefix ? 's' : ''}`;
  }
  return str;
};

export const getDurationUsingMS = (ms: number, needPrefix: boolean = true) => {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const seconds = Math.floor(minutesms / 1000);
  let str: string = '';

  if (days) {
    str = `${str ? `${str} ` : ''}${days}${needPrefix ? 'd' : ''}`;
  }
  if (hours) {
    str = `${str ? `${str} ` : ''}${hours}${needPrefix ? 'h' : ''}`;
  }
  if (minutes) {
    str = `${str ? `${str} ` : ''}${minutes}${needPrefix ? 'm' : ''}`;
  }
  if (((!hours && minutes) || !minutes) && seconds) {
    str = `${str ? `${str} ` : ''}${seconds}${needPrefix ? 's' : ''}`;
  }
  return str;
};

export function getCurrentMonthStartAndEnd() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Start of the month
  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  // End of the month
  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setUTCHours(23, 59, 59, 999);

  return {
    start: startOfMonth.toISOString(),
    end: endOfMonth.toISOString()
  };
}
