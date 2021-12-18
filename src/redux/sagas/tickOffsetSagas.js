import crypto from 'crypto';
import { put, takeLeading, call, select } from 'redux-saga/effects';
//* Actions
import { addTickOffset, removeTickOffset } from '../actions/tickOffset';
//* HTTP
import { executeBet } from '../../http/placeBets';
import updateCustomOrder from '../../http/updateCustomOrder';
//* Utils
import { getOppositeSide } from '../../utils/Bets/GetOppositeSide';
import { calcTickOffsetPrice } from '../../utils/TradingStategy/TickOffset';

function* placeTickOffsetBet(action) {
  const { tickOffset } = action.payload;
  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

  const bet = yield call(executeBet, { ...tickOffset, customerStrategyRef });
  if (bet) {
    yield call(updateCustomOrder, 'remove-bet', { rfs: tickOffset.rfs });
    yield put(removeTickOffset({ selectionId: tickOffset.selectionId }));
  }
}

export function* addTickOffsetBet(marketId, selectionId, size, side, price, rfs, betId, hedgeSize) {
  const { ticks, units, hedged, percentTrigger } = yield select(state => state.tickOffset);

  const TOS = {
    strategy: 'Tick Offset',
    marketId,
    selectionId,
    size: hedged ? hedgeSize : size,
    side: getOppositeSide(side),
    price: calcTickOffsetPrice(price, side, ticks, units === 'Percent'),
    percentageTrigger: percentTrigger,
    rfs,
    betId,
    hedged,
  };

  yield put(addTickOffset(TOS));
  yield call(updateCustomOrder('save-bet', TOS));
}

export function* watchTickOffsetBet() {
  yield takeLeading('PLACE_TICK_OFFSET_BET_SAGA', placeTickOffsetBet);
}
