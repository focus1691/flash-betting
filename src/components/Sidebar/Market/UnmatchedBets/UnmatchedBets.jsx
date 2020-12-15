import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { cancelBet, removeUnmatchedBet, updateBetPrice } from '../../../../actions/bet';
import { removeBackBet, updateBackBetPrice } from '../../../../actions/back';
import { removeLayBet, updateLayBetPrice } from '../../../../actions/lay';
import { removeStopEntryBet, updateStopEntryBetPrice } from '../../../../actions/stopEntry';
import { removeStopLoss, updateStopLossBetPrice } from '../../../../actions/stopLoss';
import { removeTickOffset, updateTickOffsetBetPrice } from '../../../../actions/tickOffset';
import { removeFillOrKill } from '../../../../actions/fillOrKill';
//* Selectors
import { getMarketUnmatchedBets } from '../../../../selectors/orderSelector';
//* Utils
import { getPriceNTicksAway } from '../../../../utils/ladder/CreateFullLadder';
import { removeBet, replaceOrders, updatePrice } from '../../../../http/dbHelper';
//* HTTP
import postData from '../../../../http/postData';
import Bet from './Bet';

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
  cancelBet,
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
  const cancelOrder = useCallback(
    async (bet) => {
      removeBet({ rfs: bet.rfs });
      switch (bet.strategy) {
        case 'Back':
          removeBackBet({ rfs: bet.rfs, selectionId: bet.selectionId });
          break;
        case 'Lay':
          removeLayBet({ rfs: bet.rfs, selectionId: bet.selectionId });
          break;
        case 'Stop Entry':
          removeStopEntryBet({ rfs: bet.rfs, selectionId: bet.selectionId });
          break;
        case 'Tick Offset':
          removeTickOffset({ selectionId: bet.selectionId });
          break;
        case 'Stop Loss':
          removeStopLoss({ selectionId: bet.selectionId });
          break;
        default:
          if (fillOrKillList[bet.betId]) {
            removeFillOrKill({ betId: bet.betId });
          }
          cancelBet(bet.marketId, bet.betId);
          break;
      }
    },
    [cancelBet, fillOrKillList, removeBackBet, removeFillOrKill, removeLayBet, removeStopEntryBet, removeStopLoss, removeTickOffset],
  );

  const replaceOrderPrice = useCallback(
    async (bet, newPrice) => {
      switch (bet.strategy) {
        case 'Back':
          updateBackBetPrice({ selectionId: bet.selectionId, rfs: bet.rfs, price: newPrice });
          break;
        case 'Lay':
          updateLayBetPrice({ selectionId: bet.selectionId, rfs: bet.rfs, price: newPrice });
          break;
        case 'Stop Entry':
          updateStopEntryBetPrice({ selectionId: bet.selectionId, rfs: bet.rfs, price: newPrice });
          break;
        case 'Tick Offset':
          updateTickOffsetBetPrice({ selectionId: bet.selectionId, price: newPrice });
          break;
        case 'Stop Loss':
          updateStopLossBetPrice({ selectionId: bet.selectionId, price: newPrice });
          break;
        case 'None': {
          const { status, instructionReports } = await postData('/api/replace-orders', {
            marketId: bet.marketId,
            betId: bet.betId,
            newPrice,
          });

          if (status === 'SUCCESS') {
            const { betId, instruction } = instructionReports[0].placeInstructionReport;
            updateBetPrice({ betId: bet.betId, newBetId: betId, price: instruction.limitOrder.price });
            removeUnmatchedBet({ betId: bet.betId });
          }
          break;
        }
        default:
          break;
      }
      updatePrice({ rfs: bet.rfs, price: newPrice });
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
      <table className="menu-bets">
        <tbody>
          <tr className="menu-bets-heading">
            <td>
              <button
                type="button"
                style={{
                  height: '22px',
                  width: 'auto',
                  backgroundColor: 'transparent',
                  visibility: 'collapse',
                  pointerEvents: 'none',
                }}
              />
            </td>
            <td>Odds</td>
            <td>Stake</td>
            <td>P/L</td>
          </tr>
          <tr>
            <td className="menu-bets-event" colSpan={4}>
              {marketName}
            </td>
          </tr>
          {marketOpen
            ? Object.values(runners).map(({ runnerName, selectionId }) => {
                const list = [];

                const BETS = Object.values(unmatchedBets)
                  .filter((bet) => bet.selectionId == selectionId)
                  .map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
                if (BETS.length.length > 0) {
                  list.push(BETS);
                }

                if (backList[selectionId]) {
                  const BACK = Object.values(backList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
                  list.push(BACK);
                }

                if (layList[selectionId]) {
                  const LAY = Object.values(layList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
                  list.push(LAY);
                }

                if (stopEntryList[selectionId]) {
                  const SE = Object.values(stopEntryList[selectionId]).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
                  list.push(SE);
                }

                if (stopLossList[selectionId]) {
                  const SL = <Bet bet={stopLossList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />;
                  list.push(SL);
                }

                if (tickOffsetList[selectionId]) {
                  const TOS = <Bet bet={tickOffsetList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />;
                  list.push(TOS);
                }

                const FOK = Object.values(fillOrKillList)
                  .filter((bet) => bet.selectionId == selectionId)
                  .map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
                if (FOK.length > 0) {
                  list.push(FOK);
                }

                if (list.length <= 0) return null;

                return (
                  <>
                    <tr className="menu-bets-selection" colSpan={4}>
                      <td>{runnerName}</td>
                    </tr>
                    {list}
                  </>
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
  cancelBet,
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
