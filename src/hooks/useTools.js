import useInterval from 'react-useinterval';
import { useSelector, useDispatch } from 'react-redux';
//* Actions
import { addUnmatchedBet, addMatchedBet, placeOrder, cancelBet, updateSizeMatched, setBetExecutionComplete } from '../redux/actions/bet';
import { removeBackBet } from '../redux/actions/back';
import { removeLayBet } from '../redux/actions/lay';
import { removeFillOrKill } from '../redux/actions/fillOrKill';
import { setStopLossBetMatched } from '../redux/actions/stopLoss';
import { placeTickOffsetBet } from '../redux/actions/tickOffset';
//* Utils
import { checkBackLayBetsAndExecute } from '../utils/TradingStategy/BackLay';
import { checkFOKBetsAndExecute } from '../utils/TradingStategy/fillOrKill';
import { isStopLossTriggered } from '../utils/TradingStategy/StopLoss';
import { isTickOffsetTriggered } from '../utils/TradingStategy/TickOffset';
//* HTTP
import fetchData from '../http/fetchData';
import { removeBet, updateOrderMatched } from '../http/dbHelper';
//* Constants
import { ONE_SECOND } from '../constants';

export default function useTest() {
  const dispatch = useDispatch();
  const marketOpen = useSelector((state) => state.market.marketOpen);
  const marketId = useSelector((state) => state.market.marketId);
  const matchedBets = useSelector((state) => state.order.bets.matched);
  const unmatchedBets = useSelector((state) => state.order.bets.unmatched);
  // customer bets
  const backList = useSelector((state) => state.back.list);
  const layList = useSelector((state) => state.lay.list);
  const fillOrKillList = useSelector((state) => state.fillOrKill.list);
  const stopLossList = useSelector((state) => state.stopLoss.list);
  const tickOffsetList = useSelector((state) => state.tickOffset.list);
  const marketStartTime = useSelector((state) => state.market.marketStartTime);
  const inPlay = useSelector((state) => state.market.inPlay);

  console.log('Test hook rendered');

  useInterval(async () => {
    if (marketOpen && marketId) {
      //* BACK Before/After Market
      checkBackLayBetsAndExecute(backList, marketStartTime, placeOrder, inPlay, removeBackBet, dispatch);

      //* LAY Before/After Market
      checkBackLayBetsAndExecute(layList, marketStartTime, placeOrder, inPlay, removeLayBet, dispatch);

      //* FOK
      checkFOKBetsAndExecute(fillOrKillList, cancelBet, removeFillOrKill, removeBet, dispatch);

      try {
        const { currentOrders } = await fetchData(`/api/listCurrentOrders?marketId=${marketId}`);
        for (let i = 0; i < currentOrders.length; i += 1) {
          const {
            marketId,
            selectionId,
            betId,
            side,
            status,
            sizeMatched,
            sizeRemaining,
            averagePriceMatched,
            priceSize: { price, size },
            customerStrategyRef: rfs,
          } = currentOrders[i];

          if (rfs) {
            //* Check if the stop loss is matched to initiate the trigger
            const isStopLossMatched = isStopLossTriggered(stopLossList[selectionId], rfs, sizeRemaining);
            if (isStopLossMatched) {
              dispatch(setStopLossBetMatched({ selectionId }));
              updateOrderMatched({ rfs, assignedIsOrderMatched: true });
            }

            /**
             * This is an asynchronous saga action that schedules one call to place the Tick Offset bet, and remove it (takes latest)
             */
            const tosTriggered = isTickOffsetTriggered(tickOffsetList[selectionId], rfs, sizeMatched);
            if (tosTriggered) dispatch(placeTickOffsetBet({ tickOffset: tickOffsetList[selectionId] }));
          }

          // Check if the bet isn't in matched/unmatched already and add it if not
          if (!unmatchedBets[betId] && !matchedBets[betId]) {
            const betParams = {
              strategy: 'None',
              marketId,
              side,
              size,
              price: status === 'EXECUTION_COMPLETE' ? averagePriceMatched : price,
              sizeMatched,
              sizeRemaining,
              selectionId,
              rfs: rfs || 'None',
              betId,
            };

            if (status === 'EXECUTABLE') dispatch(addUnmatchedBet(betParams));
            else if (status === 'EXECUTION_COMPLETE') dispatch(addMatchedBet(betParams));
          }

          // Move from unmatched to matched
          else if (status === 'EXECUTION_COMPLETE' && unmatchedBets[betId] && !matchedBets[betId]) {
            dispatch(setBetExecutionComplete({ betId, sizeMatched, sizeRemaining, price: averagePriceMatched }));
          }

          // Size matched / Size remaining has changed in the unmatched bet
          else if (status === 'EXECUTABLE' && unmatchedBets[betId] && (unmatchedBets[betId].sizeMatched != sizeMatched || unmatchedBets[betId].sizeRemaining != sizeRemaining)) {
            dispatch(updateSizeMatched({ betId, sizeMatched, sizeRemaining }));
          }
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }, ONE_SECOND);
}
