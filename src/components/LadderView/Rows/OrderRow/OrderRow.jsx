import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { changePriceType } from '../../../../redux/actions/ladder';
import { removeBackBet, removeAllSelectionBackBets } from '../../../../redux/actions/back';
import { removeLayBet, removeAllSelectionLayBets } from '../../../../redux/actions/lay';
import { removeStopEntryBet, removeAllSelectionStopEntryBets } from '../../../../redux/actions/stopEntry';
import { removeStopLoss } from '../../../../redux/actions/stopLoss';
import { removeTickOffset } from '../../../../redux/actions/tickOffset';
import { removeFillOrKill } from '../../../../redux/actions/fillOrKill';
import { MatchedBet } from './MatchedBet';
import { UnmatchedBet } from './UnmatchedBet';
//* HTTP
import { cancelBet, cancelBets } from '../../../../http/placeBets';
import updateCustomOrder from '../../../../http/updateCustomOrder';
//* Selectors
import { getSelectionMatchedBets, getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';
//* JSS
import useStyles from '../../../../jss/components/LadderView/OrderRow';

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
    removeAllSelectionBackBets,
    removeLayBet,
    removeAllSelectionLayBets,
    removeAllSelectionStopEntryBets,
    removeStopLoss,
    removeTickOffset,
    removeFillOrKill,
  }) => {
    const classes = useStyles();
    const cancelUnmatchedBet = useCallback(
      (bet) => {
        // Remove the custom order in SQLite
        updateCustomOrder('remove-bet', { rfs: bet.rfs });

        // If this order was made with the tools, it will be removed by rfs or selectionId
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
            // A BetFair unmatched order needs a cancellation request. It could also exist in a Fill or Kill list.
            if (fokList[bet.betId]) {
              removeFillOrKill({ betId: bet.betId });
            }
            cancelBet(bet.marketId, bet.betId);
            break;
        }
      },
      [fokList, removeBackBet, removeFillOrKill, removeLayBet, removeStopLoss, removeTickOffset, selectionId],
    );

    const cancelAllSelectionBets = useCallback(() => {
      // Any orders made with the tools will be removed by selectionId
      removeAllSelectionBackBets({ selectionId });
      removeAllSelectionLayBets({ selectionId });
      removeAllSelectionStopEntryBets({ selectionId });
      removeStopLoss({ selectionId });
      removeTickOffset({ selectionId });

      // Remove any BetFair orders by selectionId
      cancelBets(unmatchedBets, selectionId);

      // Remove the custom orders in SQLite
      updateCustomOrder('remove-selection-bets', { selectionId });
    }, [removeAllSelectionBackBets, removeAllSelectionLayBets, removeAllSelectionStopEntryBets, removeStopLoss, removeTickOffset, selectionId, unmatchedBets]);

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
      <div className={classes.orderRow}>
        <table>
          <tbody>
            <tr>
              <td colSpan={3} rowSpan={4}>
                <table className={classes.orderTable}>
                  <tbody className={classes.orderBody}>
                    {renderUnmatchedBets()}
                  </tbody>
                </table>
              </td>
              <td colSpan={1} rowSpan={4}>
                <button type="button">0</button>
                <button type="button" onClick={handleButtonClick}>
                  {priceType === 'STAKE' ? 'S' : 'L'}
                </button>
                <button type="button" onClick={cancelAllSelectionBets}>
                  K
                </button>
              </td>
              <td colSpan={3} rowSpan={4}>
                <table className={classes.orderTable}>
                  <tbody className={classes.orderBody}>{renderMatchedBets()}</tbody>
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
  priceType: state.ladder.priceType,
  matchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
  backList: state.back.list,
  layList: state.lay.list,
  slList: state.stopLoss.list,
  tosList: state.tickOffset.list,
  fokList: state.fillOrKill.list,
  seList: state.stopEntry.list,
});

const mapDispatchToProps = { changePriceType, removeBackBet, removeAllSelectionBackBets, removeLayBet, removeAllSelectionLayBets, removeAllSelectionStopEntryBets, removeStopLoss, removeTickOffset, removeFillOrKill };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);
