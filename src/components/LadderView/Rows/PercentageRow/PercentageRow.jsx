import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
//* Actions
import { cancelBets } from '../../../../actions/bet';
import { removeAllSelectionBackBets } from '../../../../actions/back';
import { removeAllSelectionLayBets } from '../../../../actions/lay';
import { removeStopLossOnSide } from '../../../../actions/stopLoss';
import { removeTickOffsetOnSide } from '../../../../actions/tickOffset';
import { removeStopEntryBetsOnSide } from '../../../../actions/stopEntry';
import { setBackLayColOrder } from '../../../../actions/market';
import { getLTP, getLTPDelta, getPercent, getTV } from '../../../../selectors/marketSelector';
import { getLTPstyle } from '../../../../utils/ladder/DeconstructLadder';
import CancelBets from './CancelBets';
//* Selectors
import { getSelectionUnmatchedBets } from '../../../../selectors/orderSelector';
//* JSS
import useStyles from '../../../../jss/components/LadderView/percentageRowStyle';

const PercentageRow = memo(({
  selectionId, ltp, tv, percent, ltpDelta, layFirstCol, unmatchedBets, setBackLayColOrder, cancelBets, removeAllSelectionBackBets, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide,
}) => {
  const classes = useStyles();
  const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);

  const cancelBackOrders = useCallback(() => {
    removeAllSelectionBackBets({ selectionId });
    removeStopLossOnSide({ selectionId, side: 'BACK' });
    removeTickOffsetOnSide({ selectionId, side: 'BACK' });
    removeStopEntryBetsOnSide({ selectionId, side: 'BACK' });
    cancelBets(selectionId, 'BACK', unmatchedBets);
  }, [cancelBets, removeAllSelectionBackBets, removeStopEntryBetsOnSide, removeStopLossOnSide, removeTickOffsetOnSide, selectionId, unmatchedBets]);

  const cancelLayOrders = useCallback(() => {
    removeAllSelectionLayBets({ selectionId });
    removeStopLossOnSide({ selectionId, side: 'LAY' });
    removeTickOffsetOnSide({ selectionId, side: 'LAY' });
    removeStopEntryBetsOnSide({ selectionId, side: 'LAY' });
    cancelBets(selectionId, 'LAY', unmatchedBets);
  }, [cancelBets, removeAllSelectionLayBets, removeStopEntryBetsOnSide, removeStopLossOnSide, removeTickOffsetOnSide, selectionId, unmatchedBets]);

  return (
    <div className={classes.percentageRow}>
      <div colSpan={3} className="th">
        {tv}
      </div>
      <CancelBets cancelBets={layFirstCol ? cancelLayOrders : cancelBackOrders} side="lay" layFirstCol={layFirstCol} />
      <div className="th" style={{ backgroundColor: layFirstCol ? '#FCC9D3' : '#BCE4FC' }}>
        {`${percent[layFirstCol ? 'lay' : 'back']}%`}
      </div>
      <Tooltip title="Swap Back/Lay Columns" aria-label="Swap matched columns">
        <div role="button" tabIndex="0" className="th" style={ltpStyle} onClick={() => setBackLayColOrder()}>
          {ltp[0]}
        </div>
      </Tooltip>
      <div className="th" style={{ backgroundColor: layFirstCol ? '#BCE4FC' : '#FCC9D3' }}>
        {`${percent[layFirstCol ? 'back' : 'lay']}%`}
      </div>
      <CancelBets cancelBets={layFirstCol ? cancelBackOrders : cancelLayOrders} side="back" layFirstCol={layFirstCol} />
    </div>
  );
});

const mapStateToProps = (state, { selectionId, price }) => ({
  priceType: state.market.priceType,
  ltp: getLTP(state.market.ladder, { selectionId }),
  tv: getTV(state.market.ladder, { selectionId }),
  percent: getPercent(state.market.ladder, { selectionId }),
  ltpDelta: getLTPDelta(state.market.ladder, { selectionId }),
  layFirstCol: state.market.layFirstCol,
  unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
});

const mapDispatchToProps = { setBackLayColOrder, cancelBets, removeAllSelectionBackBets, removeAllSelectionLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide };

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
