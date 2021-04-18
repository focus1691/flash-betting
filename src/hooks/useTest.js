import React, { useState, useEffect } from 'react';
import useInterval from 'react-useinterval';
import { useSelector, useDispatch } from 'react-redux'
//* Actions
import { placeOrder, addUnmatchedBet, addMatchedBet, removeUnmatchedBet, updateSizeMatched, setBetExecutionComplete } from '../actions/bet';
import { removeBackBet } from '../actions/back';
import { removeLayBet } from '../actions/lay';
import { addBackBet } from '../actions/back';
//* Utils
import { checkBackLayBetsAndExecute } from '../utils/TradingStategy/BackLay';
import { checkFOKBetsAndExecute } from '../utils/TradingStategy/fillOrKill';

const ONE_SECOND = 1000;

export default function useTest() {
  const dispatch = useDispatch();
  const backList = useSelector(state => state.back.list);
  const layList = useSelector(state => state.back.list);
  const marketStartTime = useSelector(state => state.market.marketStartTime);
  const inPlay = useSelector(state => state.market.inPlay);

  useInterval(() => {
    //* BACK Before/After Market
    checkBackLayBetsAndExecute(backList, marketStartTime, placeOrder, inPlay, removeBackBet, dispatch);

    //* LAY Before/After Market
    checkBackLayBetsAndExecute(layList, marketStartTime, placeOrder, inPlay, removeLayBet, dispatch);

    //* FOK
    // checkFOKBetsAndExecute(fillOrKillList, cancelBet, removeFillOrKill, removeBet);
  }, ONE_SECOND);
}