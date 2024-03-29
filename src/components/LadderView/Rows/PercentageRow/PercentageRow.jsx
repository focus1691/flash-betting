import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
//* Actions
import { removeAllSelectionBackBets } from '../../../../redux/actions/back';
import { removeAllSelectionLayBets } from '../../../../redux/actions/lay';
import { removeStopLossOnSide } from '../../../../redux/actions/stopLoss';
import { removeTickOffsetOnSide } from '../../../../redux/actions/tickOffset';
import { removeStopEntryBetsOnSide } from '../../../../redux/actions/stopEntry';
import { setBackLayColOrder } from '../../../../redux/actions/ladder';
import { getPercent, getTV } from '../../../../selectors/marketSelector';
import { getLadderLTPs } from '../../../../selectors/lastTradedPriceSelector';
import { getLTPstyle } from '../../../../utils/ladder/DeconstructLadder';
import CancelBets from './CancelBets';
//* HTTP
import updateCustomOrder from '../../../../http/updateCustomOrder';
import { cancelBets } from '../../../../http/placeBets';
//* Selectors
import { getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';
//* JSS
import useStyles from '../../../../jss/components/LadderView/percentageRowStyle';

const PercentageRow = memo(({ selectionId, ltps, tv, percent, layFirstCol, unmatchedBets, setBackLayColOrder, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide }) => {
  const classes = useStyles();
  const ltpStyle = useMemo(() => getLTPstyle(true, ltps), [ltps]);

  const cancelBetsOnSide = useCallback(
    (side) => {
      // Remove back / lay custom orders depending on the column's side
      if (side === 'BACK') removeAllSelectionBackBets({ selectionId })
      else if (side === 'LAY') removeAllSelectionLayBets({ selectionId });

      // Remove all stop loss, tick offset, stop entry based on selectionId and side
      removeStopLossOnSide({ selectionId, side });
      removeTickOffsetOnSide({ selectionId, side });
      removeStopEntryBetsOnSide({ selectionId, side });

      // Remove any unmatched bets on this selectionId and side
      cancelBets(unmatchedBets, selectionId, side);

      // Finally, all custom orders set by the tools are removed by selectionId and side
      updateCustomOrder('remove-selection-bets-on-side', { selectionId, side });
    },
    [selectionId, unmatchedBets],
  );

  return (
    <div className={classes.percentageRow}>
      <div colSpan={3} className="th">
        {tv}
      </div>
      <CancelBets cancelBetsOnSide={cancelBetsOnSide} side={layFirstCol ? 'LAY' : 'BACK'} layFirstCol={layFirstCol} />
      <div className="th" style={{ backgroundColor: layFirstCol ? '#eba8a6' : '#007aaf' }}>
        {`${percent[layFirstCol ? 'lay' : 'back']}%`}
      </div>
      <Tooltip title="Swap Back/Lay Columns" aria-label="Swap matched columns">
        <div role="button" tabIndex="0" className="th" style={ltpStyle} onClick={() => setBackLayColOrder()}>
          {ltps[0]}
        </div>
      </Tooltip>
      <div className="th" style={{ backgroundColor: layFirstCol ? '#007aaf' : '#eba8a6' }}>
        {`${percent[layFirstCol ? 'back' : 'lay']}%`}
      </div>
      <CancelBets cancelBetsOnSide={cancelBetsOnSide} side={layFirstCol ? 'BACK' : 'LAY'} layFirstCol={layFirstCol} />
    </div>
  );
});

const mapStateToProps = (state, { selectionId }) => ({
  priceType: state.ladder.priceType,
  ltps: getLadderLTPs(state.market.ladder, { selectionId }),
  tv: getTV(state.market.ladder, { selectionId }),
  percent: getPercent(state.market.ladder, { selectionId }),
  layFirstCol: state.ladder.layFirstCol,
  unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
});

const mapDispatchToProps = { setBackLayColOrder, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide };

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
