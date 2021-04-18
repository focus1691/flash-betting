import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { addBackBet } from '../actions/back';

export default function useTest() {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(false);
  const backList = useSelector(state => state.back.list);
  console.log(backList);

  const fakeBet = {
    strategy: 'BACK',
    marketId: '1.232323',
    selectionId: 2242424,
    size: 2,
    price: '2.02',
    side: 'BACK',
    betId: '23232232',
    rfs: '142124124sdffs',
    trailing: false,
    hedged: false,
    assignedIsOrderMatched: false,
    timeOffset: 2 * 3600 + 0 * 60 + 0,
  };

  useEffect(() => {
    setIsOnline(true);
    // dispatch(addBackBet(fakeBet));
  }, []);

  return isOnline;
}