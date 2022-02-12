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
//* HTTP
import { cancelMarketBets } from '../../http/placeBets';

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

function* processHedge(action) {
  const { side, price, selectionId, hedge } = action.payload;

  const marketId = yield select(state => state.market.marketId);
  const allUnmatchedBets = yield select(state => state.order.bets.unmatched);
  let unmatchedBets = [];

  if (allUnmatchedBets) {
    unmatchedBets = Object.values(allUnmatchedBets).filter((bet) => bet.selectionId == selectionId && parseFloat(bet.price) == parseFloat(price) && bet.side === side);
  }

  if (unmatchedBets && unmatchedBets.length > 0) {
    yield call(cancelMarketBets, marketId, unmatchedBets);
  }
  else if (hedge && hedge.size > 0) {
    const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

    yield put(placeOrder({
      marketId,
      side,
      size: hedge.size,
      price,
      selectionId,
      customerStrategyRef,
    }));
  }
};

export function* watchPlaceOrders() {
  yield takeEvery('PROCESS_ORDERS', processOrder);
  yield takeEvery('PROCESS_HEDGES', processHedge);
};
