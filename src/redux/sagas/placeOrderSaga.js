import crypto from 'crypto';
import { call, put, select, takeEvery } from 'redux-saga/effects';
//* Sagas
import { addStopLossBet } from './stopLossSagas';
import { addTickOffsetBet } from './tickOffsetSagas';
import { addFillOrKillBet } from './fillOrKillSagas';
//* Actions
import { placeOrder } from '../actions/bet';
//* Utils
import { formatPrice } from '../../utils/Bets/PriceCalculations';

function* processOrder(action) {
  const { side, price, marketId, selectionId, stopLossSelected, isStopLossActive, hedgeSize } = action.payload;

  const tickOffsetSelected = yield select(state => state.tickOffset.selected);
  const fillOrKillSelected = yield select(state => state.fillOrKill.selected);
  const stakeVal = yield select(state => state.settings.stake[selectionId]);
  const customStake = yield select(state => state.market.runners[selectionId].order.customStake);

  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
  const size = customStake || stakeVal;

  //* Place the order first with BetFair and then execute the tools
  const betId = yield put(placeOrder({
    marketId,
    selectionId,
    side,
    size,
    price: formatPrice(price),
    customerStrategyRef,
  }));

  if (betId) {
    if (stopLossSelected && !isStopLossActive) {
      yield call(addStopLossBet, marketId, selectionId, size, side, price, customerStrategyRef, betId);
    } else if (tickOffsetSelected) {
      yield call(addTickOffsetBet, marketId, selectionId, size, side, price, customerStrategyRef, betId, hedgeSize);
    }
    if (fillOrKillSelected) {
      yield call(addFillOrKillBet, marketId, selectionId, size, side, price, customerStrategyRef, betId);
    }
  }
};

export function* watchPlaceOrders() {
  yield takeEvery('PROCESS_ORDERS', processOrder);
};
