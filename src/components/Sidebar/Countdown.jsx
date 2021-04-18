import React, { useState } from 'react';
import { connect } from 'react-redux';
import useInterval from 'react-useinterval';
//* Actions
import { setPastEventTime } from '../../actions/market';
//* Utils
import { checkFOKBetsAndExecute } from '../../utils/TradingStategy/fillOrKill';
import { secondsToHms } from '../../utils/DateHelper';
import { countDownTime } from '../../utils/Market/CountDown';

const ONE_SECOND = 1000;

const Countdown = ({ marketStartTime, marketOpen, marketStatus, inPlay, inPlayTime, pastEventTime, setPastEventTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('--');

  useInterval(() => {
    setTimeRemaining(secondsToHms(countDownTime(marketOpen, marketStatus, marketStartTime, inPlay, inPlayTime, pastEventTime, setPastEventTime)));

    //* FOK
    // checkFOKBetsAndExecute(fillOrKillList, cancelBet, removeFillOrKill, removeBet);
  }, ONE_SECOND);

  return <>{timeRemaining}</>;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  marketStartTime: state.market.marketStartTime,
  inPlay: state.market.inPlay,
  inPlayTime: state.market.inPlayTime,
  pastEventTime: state.market.pastEventTime,
  layList: state.lay.list,
  backList: state.back.list,
  fillOrKillList: state.fillOrKill.list,
  tickOffsetList: state.tickOffset.list,
});

const matchDispatchToProps = {
  setPastEventTime,
};

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);
