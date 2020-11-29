import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { cancelBet, updateOrders } from '../../../../actions/bet';
import { removeBackBet } from '../../../../actions/back';
import { removeLayBet } from '../../../../actions/lay';
import { removeStopEntryBet } from '../../../../actions/stopEntry';
import { removeStopLoss } from '../../../../actions/stopLoss';
import { removeTickOffset } from '../../../../actions/tickOffset';
import { removeFillOrKill } from '../../../../actions/fillOrKill';
import { getPriceNTicksAway } from '../../../../utils/ladder/CreateFullLadder';
import { getMarketMatchedBets, getMarketUnmatchedBets } from '../../../../selectors/orderSelector';
import Bet from './Bet';

const UnmatchedBets = ({
  market,
  marketOpen,
  marketName,
  marketStartTime,
  backList,
  layList,
  stopEntryList,
  tickOffsetList,
  stopLossList,
  fillOrKillList,
  matchedBets,
  unmatchedBets,
  updateOrders,
  cancelBet,
  removeBackBet,
  removeLayBet,
  removeStopEntryBet,
  removeStopLoss,
  removeTickOffset,
  removeFillOrKill,

  rightClickTicks,
}) => {
  const cancelOrder = useCallback(
    async (bet) => {
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
    (order, newPrice) => {
      const newOrder = { ...order, price: newPrice };
      switch (order.strategy) {
        case 'Back':
          const newBackList = { ...backList };
          const indexBack = newBackList[order.selectionId].findIndex((item) => item.rfs === order.rfs);
          newBackList[order.selectionId][indexBack].price = newPrice;
          // updateBackList(newBackList);
          break;
        case 'Lay':
          const newLayList = { ...layList };
          const indexLay = newLayList[order.selectionId].findIndex((item) => item.rfs === order.rfs);
          newLayList[order.selectionId][indexLay].price = newPrice;
          // updateLayList(newLayList);
          break;
        case 'Stop Entry':
          const newStopEntryList = { ...stopEntryList };
          const indexStopEntry = newStopEntryList[order.selectionId].findIndex((item) => item.rfs === order.rfs);
          newStopEntryList[order.selectionId][indexStopEntry].price = newPrice;
          // updateStopEntryList(newStopEntryList);
          break;
        case 'Tick Offset':
          const newTickOffsetList = { ...tickOffsetList };
          newTickOffsetList[order.rfs].price = newPrice;
          // updateTickOffsetList(newTickOffsetList);
          break;
        case 'Stop Loss':
          const newStopLossList = { ...stopLossList };
          newStopLossList[order.selectionId].price = newPrice;
          // updateStopLossList(newStopLossList);
          break;
        case 'None':
          // if we can find something that fits with the fill or kill, we can remove that too (this is because we don't make another row for fill or kill)
          if (fillOrKillList[order.betId] !== undefined) {
            const newFillOrKill = { ...fillOrKillList };
            newFillOrKill[order.betId].price = newPrice;
            // updateFillOrKillList(newFillOrKill);
          }

          fetch('/api/replace-orders', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              marketId: order.marketId,
              betId: order.betId,
              newPrice,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.status === 'SUCCESS') {
                const newUnmatched = { ...unmatchedBets };

                const newBetId = res.instructionReports[0].placeInstructionReport.betId;
                newUnmatched[newBetId] = { ...newUnmatched[order.betId] };
                newUnmatched[newBetId].price = res.instructionReports[0].placeInstructionReport.instruction.limitOrder.price;
                newUnmatched[newBetId].betId = newBetId;

                delete newUnmatched[order.betId];

                updateOrders({ unmatched: newUnmatched, matched: matchedBets });
              }
            });
          break;
        default:
          break;
      }

      try {
        fetch('/api/update-price', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(newOrder),
        });
      } catch (e) {}
    },
    [backList, layList, stopEntryList, tickOffsetList, stopLossList, fillOrKillList, unmatchedBets, updateOrders, matchedBets],
  );

  const handleRightClick = useCallback(
    (order) => {
      replaceOrderPrice(order, getPriceNTicksAway(parseFloat(order.price), rightClickTicks));
    },
    [replaceOrderPrice, rightClickTicks],
  );

  const renderSpecialBets = useCallback(
    (selectionId) => {
      const list = [];

      if (stopLossList[selectionId]) {
        list.push(<Bet bet={stopLossList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
      }
      if (tickOffsetList[selectionId]) {
        list.push(<Bet bet={tickOffsetList[selectionId]} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
      }
      Object.values(fillOrKillList).forEach((FOK) => {
        if (FOK.selectionId === selectionId) {
          list.push(<Bet bet={FOK} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
        }
      });
    },
    [cancelOrder, fillOrKillList, handleRightClick, marketStartTime, stopLossList, tickOffsetList],
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
            ? market.runners.map((({ runnerName, selectionId }) => {
              const selectionBets = Object.values(unmatchedBets).filter((bet) => bet.selectionId == selectionId).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);
              const BACK = Object.values(backList[selectionId]).map((backBets) => backBets.map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />));
              const LAY = Object.values(layList[selectionId]).map((layBets) => layBets.map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />));
              const SE = Object.values(stopEntryList[selectionId]).map((seBets) => seBets.map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />));
              const FOK = Object.values(fillOrKillList).filter((bet) => bet.selectionId == selectionId).map((bet) => <Bet bet={bet} handleRightClick={handleRightClick} cancelOrder={cancelOrder} marketStartTime={marketStartTime} />);

              if (selectionBets.length <= 0 && BACK.length <= 0 && LAY.length <= 0 && SE.length <= 0 && FOK.length <= 0 && !stopLossList[selectionId] && !tickOffsetList[selectionId]) return null;

                return (
                  <>
                    <tr className="menu-bets-selection" colSpan={4}>
                      <td>{runnerName}</td>
                    </tr>
                    {selectionBets}
                    {BACK}
                    {LAY}
                    {SE}
                    {renderSpecialBets(selectionId)}
                    {FOK}
                  </>
                );
              }))
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketName: state.market.marketName,
  marketStartTime: state.marketStartTime,
  stopLossList: state.stopLoss.list,
  tickOffsetList: state.tickOffset.list,
  stopEntryList: state.stopEntry.list,
  layList: state.lay.list,
  backList: state.back.list,
  fillOrKillList: state.fillOrKill.list,
  matchedBets: getMarketMatchedBets(state.order.bets, { marketId: state.market.marketId }),
  unmatchedBets: getMarketUnmatchedBets(state.order.bets, { marketId: state.market.marketId }),
  rightClickTicks: state.settings.rightClickTicks,
});

const mapDispatchToProps = { updateOrders, cancelBet, removeBackBet, removeLayBet, removeStopEntryBet, removeStopLoss, removeTickOffset, removeFillOrKill };

export default connect(mapStateToProps, mapDispatchToProps)(UnmatchedBets);
