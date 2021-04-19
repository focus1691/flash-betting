import useInterval from 'react-useinterval';
import { useSelector, useDispatch } from 'react-redux'
//* Actions
import { placeOrder, cancelBet } from '../actions/bet';
import { removeBackBet } from '../actions/back';
import { removeLayBet } from '../actions/lay';
import { removeFillOrKill } from '../actions/fillOrKill';
//* Utils
import { checkBackLayBetsAndExecute } from '../utils/TradingStategy/BackLay';
import { checkFOKBetsAndExecute } from '../utils/TradingStategy/fillOrKill';
//* HTTP
import { removeBet } from '../http/dbHelper';

const ONE_SECOND = 1000;

export default function useTest() {
  const dispatch = useDispatch();
  const backList = useSelector(state => state.back.list);
  const layList = useSelector(state => state.lay.list);
  const fillOrKillList = useSelector(state => state.fillOrKill.list);
  const marketStartTime = useSelector(state => state.market.marketStartTime);
  const inPlay = useSelector(state => state.market.inPlay);

  console.log('use test');
  useInterval(() => {
    //* BACK Before/After Market
    checkBackLayBetsAndExecute(backList, marketStartTime, placeOrder, inPlay, removeBackBet, dispatch);

    //* LAY Before/After Market
    checkBackLayBetsAndExecute(layList, marketStartTime, placeOrder, inPlay, removeLayBet, dispatch);

    //* FOK
    checkFOKBetsAndExecute(fillOrKillList, cancelBet, removeFillOrKill, removeBet, dispatch);
  }, ONE_SECOND);
}