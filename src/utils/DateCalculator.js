import { padZeroes } from './Strings/PadZeroes';

const isPremiumActive = (now, end) => {
  if (!end) {
    return false;
  }

  end = new Date(end);

  const timeDiff = end - now;
  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysLeft > 0;
};

const getDate30DaysAhead = () => {
  const now = new Date();

  if (now.getMonth() == 11) {
    return new Date(now.getFullYear() + 1, 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
};

const getDate180DaysAhead = () => {
  const now = new Date();

  if (now.getMonth() == 6) {
    return new Date(now.getFullYear() + 6, 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
};

const getDate1YearAhead = () => {
  const now = new Date();

  if (now.getMonth() == 12) {
    return new Date(now.getFullYear() + 12, 0, 1);
  }
  return new Date(now.getFullYear(), now.getMonth() + 12, now.getDate());
};

const msToHMS = (ms) => {
  if (typeof ms !== 'number') return '--';

  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = Math.floor(parseInt(seconds / 3600)); // 3,600 seconds in 1 hour
  seconds %= 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = Math.floor(parseInt(seconds / 60)); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = Math.floor(seconds % 60);

  return Math.abs(hours) <= 0 && minutes <= 0 && seconds <= 0
    ? '00:00:00'
    : `${hours}:${padZeroes(minutes)}:${padZeroes(seconds)}`;
};

const secToMin = (seconds) => {
  let sec = Math.ceil(seconds % 60);
  const min = parseInt(seconds / 60);
  if (sec.toString().length === 1) {
    // padding
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
};

export {
  isPremiumActive, getDate30DaysAhead, getDate180DaysAhead, getDate1YearAhead, msToHMS, secToMin,
};
