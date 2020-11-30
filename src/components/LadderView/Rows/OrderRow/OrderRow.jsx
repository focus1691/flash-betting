import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { cancelBet, cancelBets } from '../../../../actions/bet';
import { changePriceType } from '../../../../actions/market';
import { removeBackBet, removeAllSelectionBackBets } from '../../../../actions/back';
import { removeLayBet, removeAllSelectionLayBets } from '../../../../actions/lay';
import { removeStopEntryBet, removeAllSelectionStopEntryBets } from '../../../../actions/stopEntry';
import { removeStopLoss } from '../../../../actions/stopLoss';
import { removeTickOffset } from '../../../../actions/tickOffset';
import { removeFillOrKill } from '../../../../actions/fillOrKill';
import { MatchedBet } from './MatchedBet';
import { UnmatchedBet } from './UnmatchedBet';
//* Selectors
import { getSelectionMatchedBets, getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';
//* Utils
import { removeBet } from '../../../../http/helper';

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
    cancelBet,
    cancelBets,
    changePriceType,
    removeBackBet,
    removeAllSelectionBackBets,
    removeLayBet,
    removeAllSelectionLayBets,
    removeAllSelectionStopEntryBets,
    removeStopLoss,
    removeTickOffset,
    removeFillOrKill,
  }) => {
    const cancelUnmatchedBet = useCallback(
      (bet) => {
        removeBet({ rfs: bet.rfs });
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
            removeTickOffset({ selectionId });
            break;
          case 'Stop Loss':
            removeStopLoss({ selectionId });
            break;
          default:
            if (fokList[bet.betId]) {
              removeFillOrKill({ betId: bet.betId });
            }
            cancelBet(bet.marketId, bet.betId);
            break;
        }
      },
      [cancelBet, fokList, removeBackBet, removeFillOrKill, removeLayBet, removeStopLoss, removeTickOffset, selectionId],
    );

    const cancelAllSelectionBets = useCallback(() => {
      removeAllSelectionBackBets({ selectionId });
      removeAllSelectionLayBets({ selectionId });
      removeAllSelectionStopEntryBets({ selectionId });
      removeStopLoss({ selectionId });
      removeTickOffset({ selectionId });
      cancelBets(selectionId, null, unmatchedBets);
    }, [cancelBets, removeAllSelectionBackBets, removeAllSelectionLayBets, removeAllSelectionStopEntryBets, removeStopLoss, removeTickOffset, selectionId, unmatchedBets]);

    const handleButtonClick = useCallback(() => {
      changePriceType(priceType === 'STAKE' ? 'LIABILITY' : 'STAKE');
    }, [priceType, changePriceType]);

    const renderUnmatchedBets = useCallback(() => {
      const list = [];

      const BETS = Object.values(unmatchedBets).filter((bet) => bet.selectionId == selectionId).map((bet) => <UnmatchedBet key={`ladder-matched-bet-${selectionId}-${bet.rfs}`} bet={bet} cancelBet={cancelUnmatchedBet} />);
      list.push(BETS);

      if (backList[selectionId]) {
        const BACK = Object.values(backList[selectionId]).map((bet) => <UnmatchedBet key={`ladder-matched-bet-${selectionId}-${bet.rfs}`} bet={bet} cancelBet={cancelUnmatchedBet} />);
        list.push(BACK);
      }

      if (layList[selectionId]) {
        const LAY = Object.values(layList[selectionId]).map((bet) => <UnmatchedBet key={`ladder-matched-bet-${selectionId}-${bet.rfs}`} bet={bet} cancelBet={cancelUnmatchedBet} />);
        list.push(LAY);
      }

      if (slList[selectionId]) {
        list.push(<UnmatchedBet key={`ladder-matched-bet-${selectionId}-${slList[selectionId].rfs}`} bet={slList[selectionId]} cancelBet={cancelUnmatchedBet} />);
      }

      if (tosList[selectionId]) {
        list.push(<UnmatchedBet key={`ladder-matched-bet-${selectionId}-${tosList[selectionId].rfs}`} bet={tosList[selectionId]} cancelBet={cancelUnmatchedBet} />);
      }

      if (seList[selectionId]) {
        const SE = Object.values(seList[selectionId]).map((bet) => <UnmatchedBet key={`ladder-matched-bet-${selectionId}-${bet.rfs}`} bet={bet} cancelBet={cancelUnmatchedBet} />);
        list.push(SE);
      }

      const FOK = Object.values(fokList).filter((bet) => bet.selectionId == selectionId).map((bet) => <UnmatchedBet key={`ladder-matched-bet-${selectionId}-${bet.rfs}`} bet={bet} cancelBet={cancelUnmatchedBet} />);
      list.push(FOK);

      return list;
    }, [backList, cancelUnmatchedBet, fokList, layList, seList, selectionId, slList, tosList, unmatchedBets]);

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

const mapDispatchToProps = { changePriceType, cancelBet, cancelBets, removeBackBet, removeAllSelectionBackBets, removeLayBet, removeAllSelectionLayBets, removeAllSelectionStopEntryBets, removeStopLoss, removeTickOffset, removeFillOrKill };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);
