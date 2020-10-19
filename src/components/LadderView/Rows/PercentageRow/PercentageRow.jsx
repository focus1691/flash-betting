import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { setBackLayColOrder } from '../../../../actions/market';
import {
  getLTP, getLTPDelta, getPercent, getTV,
} from '../../../../selectors/marketSelector';
import { getLTPstyle } from '../../../../utils/ladder/DeconstructLadder';
import { getUnmatchedBetsOnRow } from '../../../../selectors/orderSelector';
import CancelOrders from './CancelOrders';

const PercentageRow = memo(({
  ltp, tv, percent, ltpDelta, layFirstCol, setBackLayColOrder, cancelSpecialOrders, unmatchedBackBets, unmatchedLayBets,
}) => {
  const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);

  const cancelAllOrdersOnSide = useCallback(async (orders, side) => {
    cancelSpecialOrders(orders, side);
  }, [cancelSpecialOrders]);

  const cancelBackOrders = useCallback(() => {
    cancelAllOrdersOnSide(unmatchedBackBets);
  }, [cancelAllOrdersOnSide, unmatchedBackBets]);

  const cancelLayOrders = useCallback(() => {
    cancelAllOrdersOnSide(unmatchedLayBets);
  }, [cancelAllOrdersOnSide, unmatchedLayBets]);

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
        <div className="th" style={ltpStyle} onClick={() => setBackLayColOrder()}>
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
  unmatchedBackBets: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side: 'BACK' }),
  unmatchedLayBets: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side: 'LAY' }),
  layFirstCol: state.market.layFirstCol,
});

const mapDispatchToProps = { setBackLayColOrder };

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
