import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useInterval from 'react-useinterval';
import { useSelector, useDispatch } from 'react-redux';
//* Actions
import { setMarketPL } from '../redux/actions/ladder';
import { addUnmatchedBet, addMatchedBet, placeOrder, removeUnmatchedBets, updateSizeMatched, setBetExecutionComplete } from '../redux/actions/bet';
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
import updateCustomOrder from '../http/updateCustomOrder';
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
      checkFOKBetsAndExecute(fillOrKillList, removeFillOrKill, updateCustomOrder, dispatch);

      try {
        const { currentOrders } = await fetchData(`/api/listCurrentOrders?marketId=${marketId}`);
        const betIds = [];
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
            placedDate,
          } = currentOrders[i];

          betIds.push(betId);

          if (rfs) {
            //* Check if the stop loss is matched to initiate the trigger
            const isStopLossMatched = isStopLossTriggered(stopLossList[selectionId], rfs, sizeRemaining);
            if (isStopLossMatched) {
              dispatch(setStopLossBetMatched({ selectionId }));
              updateCustomOrder('update-bet-matched', { rfs, assignedIsOrderMatched: true });
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
              placedDate,
            };

            console.log(`Adding new bet (${status}) to the list: ${betParams}`);

            if (status === 'EXECUTABLE') dispatch(addUnmatchedBet(betParams));
            else if (status === 'EXECUTION_COMPLETE') dispatch(addMatchedBet(betParams));
          }

          // Move from unmatched to matched
          else if (status === 'EXECUTION_COMPLETE' && unmatchedBets[betId] && !matchedBets[betId]) {
            console.log(`Moving bet from unmatched to matched ${betId}`);
            dispatch(setBetExecutionComplete({ betId, sizeMatched, sizeRemaining, price: averagePriceMatched }));
          }

          // Size matched / Size remaining has changed in the unmatched bet
          else if (status === 'EXECUTABLE' && unmatchedBets[betId] && (unmatchedBets[betId].sizeMatched != sizeMatched || unmatchedBets[betId].sizeRemaining != sizeRemaining)) {
            dispatch(updateSizeMatched({ betId, sizeMatched, sizeRemaining }));
          }
        }
        // Check to see if a bet exists in unmatched bets that should be removed (probably due to cancellation)
        const removedBets = Object.keys(unmatchedBets).filter((betId) => !betIds.includes(betId));
        if (!isEmpty(removedBets)) {
          dispatch(removeUnmatchedBets({ betIds: removedBets }));
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }, ONE_SECOND);

  useEffect(() => {
    (async () => {
      if (marketOpen && marketId) {
        const result = await fetchData(`/api/list-market-pl?marketId=${marketId}`);
        if (result && result[0]) {
          const selectionPL = result[0].profitAndLosses.reduce((acc, item) => {
            acc[item.selectionId] = item.ifWin;
            return acc;
          }, {});
          dispatch(setMarketPL(selectionPL));
        }
      }
    })();
  }, [marketOpen, marketId, matchedBets]);
}
