import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { changePriceType } from '../../../../actions/market';
import { removeBackBet, removeAllBackBets } from '../../../../actions/back';
import { removeLayBet, removeAllLayBets } from '../../../../actions/lay';
import { removeStopEntryBet, removeAllStopEntryBets } from '../../../../actions/stopEntry';
import { removeStopLoss } from '../../../../actions/stopLoss';
import { removeTickOffset } from '../../../../actions/tickOffset';
import { MatchedBet } from './MatchedBet';
import { UnmatchedBet } from './UnmatchedBet';
import { getSelectionMatchedBets, getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';

const OrderRow = memo(
  ({
    selectionId,
    matchedBets,
    unmatchedBets,
    backList,
    layList,
    slList,
    tosList,
    fokList,
    seList,
    priceType,
    changePriceType,
    removeBackBet,
    removeAllBackBets,
    removeLayBet,
    removeAllLayBets,
    removeAllStopEntryBets,
    removeStopLoss,
    removeTickOffset,
  }) => {
    const cancelUnmatchedBet = useCallback(
      (bet) => {
        // cancelSpecialOrders(bet);

        switch (bet.strategy) {
          case 'Back':
            removeBackBet({ rfs: bet.rfs, selectionId });
            break;
          case 'Lay':
            removeLayBet({ rfs: bet.rfs, selectionId });
            break;
          case 'Stop Entry':
            removeStopEntryBet({ rfs: bet.rfs, selectionId });
            break;
          case 'Tick Offset':
            removeTickOffset({ rfs: bet.rfs });
            break;
          case 'Stop Loss':
            removeStopLoss({ selectionId });
            break;
          default:
            // if (fillOrKillList[bet.betId]) delete newFillOrKill[bet.betId];
            executeCancelBet(bet);
            break;
        }
      },
      [removeBackBet, removeLayBet, removeStopLoss, removeTickOffset, selectionId],
    );

    const cancelAllSelectionBets = useCallback(() => {
      // cancelSpecialOrders();
      removeAllBackBets({ selectionId });
      removeAllLayBets({ selectionId });
      removeAllStopEntryBets({ selectionId });
      removeStopLoss({ selectionId });
      removeTickOffset({ selectionId });
    }, [removeAllBackBets, removeAllLayBets, removeAllStopEntryBets, removeStopLoss, removeTickOffset, selectionId]);

    const handleButtonClick = useCallback(() => {
      changePriceType(priceType === 'STAKE' ? 'LIABILITY' : 'STAKE');
    }, [priceType, changePriceType]);

    const renderSpecialBets = useCallback(
      (bets) => {
        const list = [];
        for (const id in bets) {
          if (Array.isArray(bets[id])) {
            for (let i = 0; i < bets[id].length; i += 1) {
              if (selectionId == bets[id][i].selectionId) {
                list.push(<UnmatchedBet key={`ladder-matched-bet-${bets[id][i].selectionId}-${bets[id][i].rfs}`} bet={bets[id][i]} cancelBet={cancelUnmatchedBet} />);
              }
            }
          } else if (selectionId == bets[id].selectionId) {
            list.push(<UnmatchedBet key={`ladder-matched-bet-${bets[id].selectionId}-${bets[id].rfs}`} bet={bets[id]} cancelBet={cancelUnmatchedBet} />);
          }
        }
        return list;
      },
      [selectionId, cancelUnmatchedBet],
    );

    const renderUnmatchedBets = useCallback(() => {
      const list = [];
      for (let i = 0; i < unmatchedBets.length; i += 1) {
        list.push(<UnmatchedBet key={`ladder-unmatched-bet-${unmatchedBets[i].selectionId}-${unmatchedBets[i].rfs}-${i}`} bet={unmatchedBets[i]} cancelBet={cancelUnmatchedBet} />);
      }
      return list;
    }, [cancelUnmatchedBet, unmatchedBets]);

    const renderMatchedBets = useCallback(() => {
      const list = [];
      for (let i = 0; i < unmatchedBets.length; i += 1) {
        if (unmatchedBets[i].sizeMatched > 0) {
          list.push(<MatchedBet key={`ladder-matched-bet-${unmatchedBets[i].selectionId}-${i}`} bet={unmatchedBets[i]} />);
        }
      }
      for (let j = 0; j < matchedBets.length; j += 1) {
        list.push(<MatchedBet key={`ladder-matched-bet-${matchedBets[j].selectionId}-${j + list.length + 1}`} bet={matchedBets[j]} />);
      }
      return list;
    }, [matchedBets, unmatchedBets]);

    return (
      <div className="order-row">
        <table>
          <tbody>
            <tr>
              <td colSpan={3} rowSpan={4} style={{ verticalAlign: 'top' }}>
                <table className="lay-table">
                  <tbody className="lay-body">
                    {renderUnmatchedBets()}
                    {renderSpecialBets(backList)}
                    {renderSpecialBets(layList)}
                    {renderSpecialBets(slList)}
                    {renderSpecialBets(tosList)}
                    {renderSpecialBets(fokList)}
                    {renderSpecialBets(seList)}
                  </tbody>
                </table>
              </td>
              <td colSpan={1} rowSpan={4} style={{ verticalAlign: 'top', minHeight: '1.675em' }}>
                <button type="button">0</button>
                <button type="button" onClick={handleButtonClick}>
                  {priceType === 'STAKE' ? 'S' : 'L'}
                </button>
                <button type="button" onClick={cancelAllSelectionBets}>
                  K
                </button>
              </td>
              <td colSpan={3} rowSpan={4} style={{ verticalAlign: 'top' }}>
                <table className="lay-table">
                  <tbody className="lay-body">{renderMatchedBets()}</tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
);

const mapStateToProps = (state, { selectionId }) => ({
  priceType: state.market.priceType,
  matchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
  backList: state.back.list,
  layList: state.lay.list,
  slList: state.stopLoss.list,
  tosList: state.tickOffset.list,
  fokList: state.fillOrKill.list,
  seList: state.stopEntry.list,
});

const mapDispatchToProps = { changePriceType, removeBackBet, removeAllBackBets, removeLayBet, removeAllLayBets, removeAllStopEntryBets, removeStopLoss, removeTickOffset };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);
