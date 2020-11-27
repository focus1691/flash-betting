import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
//* Actions
import { removeAllBackBets } from '../../../../actions/back';
import { removeAllLayBets } from '../../../../actions/lay';
import { removeStopLossOnSide } from '../../../../actions/stopLoss';
import { removeTickOffsetOnSide } from '../../../../actions/tickOffset';
import { removeStopEntryBetsOnSide } from '../../../../actions/stopEntry';
import { setBackLayColOrder } from '../../../../actions/market';
import { getLTP, getLTPDelta, getPercent, getTV } from '../../../../selectors/marketSelector';
import { getLTPstyle } from '../../../../utils/ladder/DeconstructLadder';
import CancelOrders from './CancelOrders';

const PercentageRow = memo(({ selectionId, ltp, tv, percent, ltpDelta, layFirstCol, setBackLayColOrder, removeAllBackBets, removeAllLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide }) => {
  const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);

  const cancelBackOrders = useCallback(() => {
    // cancelAllOrdersOnSide(unmatchedBackBets);
    removeAllBackBets({ selectionId });
    removeStopLossOnSide({ selectionId, side: 'BACK' });
    removeTickOffsetOnSide({ selectionId, side: 'BACK' });
    removeStopEntryBetsOnSide({ selectionId, side: 'BACK' });
  }, [removeAllBackBets, removeStopEntryBetsOnSide, removeStopLossOnSide, removeTickOffsetOnSide, selectionId]);

  const cancelLayOrders = useCallback(() => {
    // cancelAllOrdersOnSide(unmatchedLayBets);
    removeAllLayBets({ selectionId });
    removeStopLossOnSide({ selectionId, side: 'LAY' });
    removeTickOffsetOnSide({ selectionId, side: 'LAY' });
    removeStopEntryBetsOnSide({ selectionId, side: 'LAY' });
  }, [removeAllLayBets, removeStopEntryBetsOnSide, removeStopLossOnSide, removeTickOffsetOnSide, selectionId]);

  return (
    <div className="percentage-row">
      <div colSpan={3} className="th">
        {tv}
      </div>
      <CancelOrders cancelOrders={layFirstCol ? cancelLayOrders : cancelBackOrders} side="lay" layFirstCol={layFirstCol} />
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
      <CancelOrders cancelOrders={layFirstCol ? cancelBackOrders : cancelLayOrders} side="back" layFirstCol={layFirstCol} />
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
});

const mapDispatchToProps = { setBackLayColOrder, removeAllBackBets, removeAllLayBets, removeStopLossOnSide, removeTickOffsetOnSide, removeStopEntryBetsOnSide };

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
