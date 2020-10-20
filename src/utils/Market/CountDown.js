const countDownTime = (marketOpen, marketStartTime, inPlay, inPlayTime, pastEventTime, onPastEventTime) => {
  if (!marketOpen) {
    return '--';
  }
  const currentTime = inPlay ? inPlayTime : marketStartTime;
  if (new Date() < new Date(currentTime)) {
    return new Date(currentTime) - new Date();
  }
  if (new Date() > new Date(currentTime)) {
    if (!pastEventTime) onPastEventTime();
    return Math.abs(new Date(currentTime) - new Date());
  }
  return '--';
};

export { countDownTime };
