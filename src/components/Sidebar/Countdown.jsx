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
import { checkBackBets, checkLayBets } from '../../utils/TradingStategy/BackLay';
import { countDownTime } from '../../utils/Market/CountDown';
import { msToHMS } from '../../utils/DateCalculator';

const ONE_SECOND = 1000;

const Countdown = ({ marketStartTime, marketOpen, marketStatus, inPlay, inPlayTime, pastEventTime, setPastEventTime, placeOrder, removeBet, backList, layList, fillOrKillList, removeBackBet, removeLayBet, removeFillOrKill }) => {
  const [timeRemaining, setTimeRemaining] = useState('--');
  const [currTime, setCurrTime] = useState(null);

  const setTime = () => {
    if (marketOpen) {
      if (marketStatus === 'OPEN' || marketStatus === 'RUNNING') {
        setCurrTime(msToHMS(timeRemaining));
      } else if (marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') {
        setCurrTime(marketStatus);
      }
    }
  };

  useInterval(async () => {
    setTimeRemaining(countDownTime(marketOpen, marketStartTime, inPlay, inPlayTime, pastEventTime, setPastEventTime));
    setTime();

    //* BACK Before/After Market
    checkBackBets(backList, marketStartTime, placeOrder, inPlay, removeBackBet);

    //* LAY Before/After Market
    checkLayBets(layList, marketStartTime, placeOrder, inPlay, removeLayBet);

    //* FOK
    const betIds = Object.values(fillOrKillList);

    for (let i = 0; i < betIds.length; i += 1) {
      const FOK = fillOrKillList[betIds[i]];
      if (FOK && Date.now() / 1000 - FOK.startTime / 1000 >= FOK.seconds) {
        removeFillOrKill({ betId: FOK.betId }); // FOK Action
        cancelBet(FOK.marketId, FOK.betId); // BetFair
        removeBet({ rfs: FOK.rfs }); // DB
      }
    }
  }, ONE_SECOND);

  return <div>{currTime}</div>;
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
