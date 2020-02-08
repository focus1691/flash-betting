

const countDownTime = (market, inPlay, inPlayTime, pastEventTime, onPastEventTime) => {
    if (!market) {
        return "--";
      }
      let currentTime = inPlay ? inPlayTime : market.marketStartTime;
      if (new Date() < new Date(currentTime)) {
        return new Date(currentTime) - new Date();
      }
      else if (new Date() > new Date(currentTime)) {
        if (!pastEventTime) onPastEventTime();
        return Math.abs(new Date(currentTime) - new Date());
      } else {
        return "--";
      }
};

export { countDownTime };