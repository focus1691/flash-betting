import { isEmpty } from 'lodash';
import uuid from 'react-uuid';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { removeUnmatchedBet, updateBetPrice } from '../../../../redux/actions/bet';
import { removeBackBet, updateBackBetPrice } from '../../../../redux/actions/back';
import { removeLayBet, updateLayBetPrice } from '../../../../redux/actions/lay';
import { removeStopEntryBet, updateStopEntryBetPrice } from '../../../../redux/actions/stopEntry';
import { removeStopLoss, updateStopLossBetPrice } from '../../../../redux/actions/stopLoss';
import { removeTickOffset, updateTickOffsetBetPrice } from '../../../../redux/actions/tickOffset';
import { removeFillOrKill } from '../../../../redux/actions/fillOrKill';
//* Selectors
import { getMarketUnmatchedBets } from '../../../../selectors/orderSelector';
//* Utils
import { getPriceNTicksAway } from '../../../../utils/Bets/PriceCalculations';
import { isBetFairBet } from '../../../../utils/Bets/BetStatus';
import updateCustomOrder from '../../../../http/updateCustomOrder';
//* HTTP
import postData from '../../../../http/postData';
import { cancelBet } from '../../../../http/placeBets';
import Bet from './Bet';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/betsStyle';

const UnmatchedBets = ({
  marketOpen,
  marketName,
  marketStartTime,
  runners,
  backList,
  layList,
  stopEntryList,
  tickOffsetList,
  stopLossList,
  fillOrKillList,
  unmatchedBets,
  updateBetPrice,
  removeUnmatchedBet,
  removeBackBet,
  updateBackBetPrice,
  removeLayBet,
  updateLayBetPrice,
  removeStopEntryBet,
  updateStopEntryBetPrice,
  removeStopLoss,
  updateStopLossBetPrice,
  removeTickOffset,
  updateTickOffsetBetPrice,
  removeFillOrKill,
  rightClickTicks,
}) => {
  const classes = useStyles();
  const cancelOrder = useCallback(
    async ({ betId, marketId, rfs, selectionId, strategy }) => {
      //* Remove from SQLite
      updateCustomOrder('remove-bet', { rfs });

      if (isBetFairBet(betId, unmatchedBets)) {
        //* Cancel on BetFair
        cancelBet(marketId, betId);
      }
      if (fillOrKillList[betId]) {
        removeFillOrKill({ betId });
      }

      // If a custom order, remove them from their list in redux
      switch (strategy) {
        case 'Back':
          removeBackBet({ rfs, selectionId });
          break;
        case 'Lay':
          removeLayBet({ rfs, selectionId });
          break;
        case 'Stop Entry':
          removeStopEntryBet({ rfs, selectionId });
          break;
        case 'Tick Offset':
          removeTickOffset({ rfs, selectionId });
          break;
        case 'Stop Loss':
          removeStopLoss({ rfs, selectionId });
          break;
        default:
          break;
      }
    },
    [unmatchedBets, fillOrKillList],
  );

  const replaceOrderPrice = useCallback(
    async ({ rfs, selectionId, marketId, betId, strategy }, newPrice) => {
      switch (strategy) {
        case 'Back':
          updateBackBetPrice({ selectionId, rfs, price: newPrice });
          break;
        case 'Lay':
          updateLayBetPrice({ selectionId, rfs, price: newPrice });
          break;
        case 'Stop Entry':
          updateStopEntryBetPrice({ selectionId, rfs, price: newPrice });
          break;
        case 'Tick Offset':
          updateTickOffsetBetPrice({ selectionId, price: newPrice });
          break;
        case 'Stop Loss':
          updateStopLossBetPrice({ selectionId, price: newPrice });
          break;
        case 'None': {
          const { status, instructionReports } = await postData('/api/replace-orders', {
            marketId,
            betId,
            newPrice,
          });

          if (status === 'SUCCESS') {
            const {
              betId,
              instruction: {
                limitOrder: { price },
              },
            } = instructionReports[0].placeInstructionReport;
            updateBetPrice({ betId, newBetId: betId, price });
            removeUnmatchedBet({ betId });
          }
          break;
        }
        default:
          break;
      }
      updateCustomOrder('update-price', { rfs, price: newPrice });
    },
    [updateBackBetPrice, updateLayBetPrice, updateStopEntryBetPrice, updateTickOffsetBetPrice, updateStopLossBetPrice, updateBetPrice, removeUnmatchedBet],
  );

  const handleRightClick = useCallback(
    (order) => {
      replaceOrderPrice(order, getPriceNTicksAway(parseFloat(order.price), rightClickTicks));
    },
    [replaceOrderPrice, rightClickTicks],
  );

  return (
    <div>
      <table className={classes.menuBets}>
        <tbody>
          <tr className={classes.heading} key={`unmatched-bet-header-sidebar-${uuid()}`}>
            <td colSpan={2}>Odds</td>
            <td colSpan={2}>Stake</td>
            <td colSpan={4}>P/L</td>
            <td colSpan={1} />
          </tr>
          <tr key={`unmatched-bet-event-name-${uuid()}`}>
            <td className={classes.event} colSpan={9}>
              {marketName}
            </td>
          </tr>
          {marketOpen
            ? Object.values(runners).map(({ runnerName, selectionId }) => {
                const list = [];

                const BETS = Object.values(unmatchedBets)
                  .filter((bet) => bet.selectionId == selectionId)
                  .map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />);
                if (BETS.length > 0) {
                  list.push(BETS);
                }

                if (!isEmpty(backList[selectionId])) {
                  const BACK = Object.values(backList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />);
                  list.push(BACK);
                }

                if (!isEmpty(layList[selectionId])) {
                  const LAY = Object.values(layList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />);
                  list.push(LAY);
                }

                if (!isEmpty(stopEntryList[selectionId])) {
                  const SE = Object.values(stopEntryList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />);
                  list.push(SE);
                }

                if (!isEmpty(stopLossList[selectionId])) {
                  const SL = <Bet bet={stopLossList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />;
                  list.push(SL);
                }

                if (!isEmpty(tickOffsetList[selectionId])) {
                  const TOS = <Bet bet={tickOffsetList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />;
                  list.push(TOS);
                }

                const FOK = Object.values(fillOrKillList)
                  .filter((bet) => bet.selectionId == selectionId)
                  .map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} key={`unmatched-bet-sidebar-${uuid()}`} />);
                if (FOK.length > 0) {
                  list.push(FOK);
                }

                if (list.length <= 0) return null;

                return (
                  <React.Fragment key={`sidebar-unmatched-bets-group-${selectionId}`}>
                    <tr className={classes.selection} colSpan={9}>
                      <td colSpan={9}>{runnerName}</td>
                    </tr>
                    {list}
                  </React.Fragment>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  marketStartTime: state.market.marketStartTime,
  runners: state.market.runners,
  stopLossList: state.stopLoss.list,
  tickOffsetList: state.tickOffset.list,
  stopEntryList: state.stopEntry.list,
  layList: state.lay.list,
  backList: state.back.list,
  fillOrKillList: state.fillOrKill.list,
  unmatchedBets: getMarketUnmatchedBets(state.order.bets, { marketId: state.market.marketId }),
  rightClickTicks: state.settings.rightClickTicks,
});

const mapDispatchToProps = {
  updateBetPrice,
  removeUnmatchedBet,
  removeBackBet,
  updateBackBetPrice,
  removeLayBet,
  updateLayBetPrice,
  removeStopEntryBet,
  updateStopEntryBetPrice,
  removeStopLoss,
  updateStopLossBetPrice,
  removeTickOffset,
  updateTickOffsetBetPrice,
  removeFillOrKill,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnmatchedBets);
