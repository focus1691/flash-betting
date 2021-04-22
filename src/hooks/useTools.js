import useInterval from 'react-useinterval';
import { useSelector, useDispatch } from 'react-redux';
//* Actions
import { addUnmatchedBet, addMatchedBet, placeOrder, cancelBet, updateSizeMatched, setBetExecutionComplete } from '../actions/bet';
import { removeBackBet } from '../actions/back';
import { removeLayBet } from '../actions/lay';
import { removeFillOrKill } from '../actions/fillOrKill';
import { setStopLossBetMatched } from '../actions/stopLoss';
import { removeTickOffset } from '../actions/tickOffset';
//* Utils
import { checkBackLayBetsAndExecute } from '../utils/TradingStategy/BackLay';
import { checkFOKBetsAndExecute } from '../utils/TradingStategy/fillOrKill';
import { checkStopLossTrigger } from '../utils/TradingStategy/StopLoss';
import { checkTickOffsetTrigger } from '../utils/TradingStategy/TickOffset';
//* HTTP
import fetchData from '../http/fetchData';
import { removeBet, updateOrderMatched } from '../http/dbHelper';
//* Constants
import { TWO_HUNDRED_AND_FIFTY_MILLISECONDS } from '../constants';

export default function useTest() {
  const dispatch = useDispatch();
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

  console.log('use test');
  useInterval(async () => {
    if (marketId) {
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

          // Check if the bet isn't in matched/unmatched already and add it if not
          if (!unmatchedBets[betId] && !matchedBets[betId]) {
            const betParams = {
              strategy: 'None',
              marketId,
              side,
              size,
              sizeMatched,
              sizeRemaining,
              selectionId,
              rfs: rfs || 'None',
              betId,
            };

            if (status === 'EXECUTABLE') {
              // Original price requested
              betParams.price = price;
              dispatch(addUnmatchedBet(betParams));
            } else if (status === 'EXECUTION_COMPLETE') {
              // Average price matched
              betParams.price = averagePriceMatched;
              dispatch(addMatchedBet(betParams));
            }
          }

          // We only track the bets if the customerStrategyRef doesn't exist, otherwise OCM handles this
          else if (!rfs) {
            //* Check if the stop loss is matched to initiate the trigger
            const isStopLossMatched = checkStopLossTrigger(stopLossList[selectionId], rfs, sizeRemaining);
            if (isStopLossMatched) {
              dispatch(setStopLossBetMatched({ selectionId }));
              updateOrderMatched({ rfs, assignedIsOrderMatched: true });
            }

            const tosTriggered = checkTickOffsetTrigger(tickOffsetList[rfs], sizeMatched);
            if (tosTriggered) {
              const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
              const { side, size, price } = tickOffsetList[rfs];

              dispatch(placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef }));
              dispatch(removeTickOffset({ selectionId })); // Remove from state
              removeBet({ rfs }); // Remove from database
            }

            // Move from unmatched to matched
            if (status === 'EXECUTION_COMPLETE' && !matchedBets[betId]) {
              dispatch(setBetExecutionComplete({ betId, sizeMatched, sizeRemaining }));
            } else if (status === 'EXECUTABLE') {
              if (!unmatchedBets[betId]) {
                // Add it to unmatched
                dispatch(addUnmatchedBet({
                  strategy: 'None',
                  marketId,
                  side,
                  price,
                  size,
                  sizeMatched,
                  sizeRemaining,
                  selectionId,
                  rfs: rfs || 'None',
                  betId,
                }));
              } else if (unmatchedBets[betId].sizeMatched != sizeMatched || unmatchedBets.sizeRemaining != sizeRemaining) {
                // update the prices
                dispatch(updateSizeMatched({ betId, sizeMatched, sizeRemaining }));
              }
            }
          }
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }, TWO_HUNDRED_AND_FIFTY_MILLISECONDS);
}