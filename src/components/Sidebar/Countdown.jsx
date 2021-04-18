import React, { useState } from 'react';
import { connect } from 'react-redux';
import useInterval from 'react-useinterval';
//* Actions
import { placeOrder, cancelBet } from '../../actions/bet';
import { removeBackBet } from '../../actions/back';
import { removeLayBet } from '../../actions/lay';
import { removeFillOrKill } from '../../actions/fillOrKill';
import { updateTickOffsetList } from '../../actions/tickOffset';
import { setPastEventTime } from '../../actions/market';
//* HTTP
import { removeBet } from '../../http/dbHelper';
//* Utils
import { checkBackLayBetsAndExecute } from '../../utils/TradingStategy/BackLay';
import { checkFOKBetsAndExecute } from '../../utils/TradingStategy/fillOrKill';
import { secondsToHms } from '../../utils/DateHelper';
import { countDownTime } from '../../utils/Market/CountDown';

const ONE_SECOND = 1000;

const Countdown = ({ marketStartTime, marketOpen, marketStatus, inPlay, inPlayTime, pastEventTime, setPastEventTime, placeOrder, removeBet, backList, layList, fillOrKillList, removeBackBet, removeLayBet, removeFillOrKill }) => {
  const [timeRemaining, setTimeRemaining] = useState('--');

  useInterval(() => {
    setTimeRemaining(secondsToHms(countDownTime(marketOpen, marketStatus, marketStartTime, inPlay, inPlayTime, pastEventTime, setPastEventTime)));

    //* BACK Before/After Market
    // checkBackLayBetsAndExecute(backList, marketStartTime, placeOrder, inPlay, removeBackBet);

    //* LAY Before/After Market
    // checkBackLayBetsAndExecute(layList, marketStartTime, placeOrder, inPlay, removeLayBet);

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
  placeOrder,
  removeBet,
  removeBackBet,
  removeLayBet,
  removeFillOrKill,
  updateTickOffsetList,
  setPastEventTime,
};

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);
