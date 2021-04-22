export const countDownTime = (marketOpen, marketStatus, marketStartTime, inPlay, inPlayTime, pastEventTime, onPastEventTime) => {
  if (!marketOpen || !marketStartTime) {
    return '--';
  }
  if (marketStatus === 'OPEN' || marketStatus === 'RUNNING') {
    const currentTime = inPlay ? inPlayTime : marketStartTime;

    if (!currentTime) return marketStatus;

    if (new Date() < new Date(currentTime)) {
      return new Date(currentTime).valueOf() / 1000 - new Date().valueOf() / 1000;
    }
    if (new Date() > new Date(currentTime)) {
      if (!pastEventTime) onPastEventTime();
      return Math.abs(new Date(currentTime).valueOf() / 1000 - new Date().valueOf() / 1000);
    }
  } else if (marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') {
    return marketStatus;
  }
  return '--';
};
