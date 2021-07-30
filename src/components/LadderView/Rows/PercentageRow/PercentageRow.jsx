import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
//* Actions
import { cancelBets } from '../../../../redux/actions/bet';
import { removeAllSelectionBackBets } from '../../../../redux/actions/back';
import { removeAllSelectionLayBets } from '../../../../redux/actions/lay';
import { removeStopLossOnSide } from '../../../../redux/actions/stopLoss';
import { removeTickOffsetOnSide } from '../../../../redux/actions/tickOffset';
import { removeStopEntryBetsOnSide } from '../../../../redux/actions/stopEntry';
import { setBackLayColOrder } from '../../../../redux/actions/ladder';
import { getLTP, getLTPDelta, getPercent, getTV } from '../../../../selectors/marketSelector';
import { getLTPstyle } from '../../../../utils/ladder/DeconstructLadder';
import CancelBets from './CancelBets';
//* Selectors
import { getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';
//* JSS
import useStyles from '../../../../jss/components/LadderView/percentageRowStyle';

const PercentageRow = memo(({ selectionId, ltp, tv, percent, ltpDelta, layFirstCol, unmatchedBets, setBackLayColOrder, cancelBets, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide }) => {
  const classes = useStyles();
  const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);

  const cancelBetsOnSide = useCallback(
    (side) => {
      if (side === 'BACK') removeAllSelectionBackBets({ selectionId })
      else if (side === 'LAY') removeAllSelectionLayBets({ selectionId });
      removeStopLossOnSide({ selectionId, side });
      removeTickOffsetOnSide({ selectionId, side });
      removeStopEntryBetsOnSide({ selectionId, side });
      cancelBets(selectionId, side, unmatchedBets);
    },
    [selectionId],
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
          {ltp[0]}
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
  ltp: getLTP(state.market.ladder, { selectionId }),
  tv: getTV(state.market.ladder, { selectionId }),
  percent: getPercent(state.market.ladder, { selectionId }),
  ltpDelta: getLTPDelta(state.market.ladder, { selectionId }),
  layFirstCol: state.ladder.layFirstCol,
  unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
});

const mapDispatchToProps = { setBackLayColOrder, cancelBets, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide };

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
