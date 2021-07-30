import crypto from 'crypto';
import { put, takeLeading, call } from 'redux-saga/effects';
import { executeBet } from '../../http/placeBets';
import updateCustomOrder from '../../http/updateCustomOrder';
import { removeTickOffset } from '../actions/tickOffset';

function* placeTickOffsetBet(action) {
  const { tickOffset } = action.payload;
  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

  const bet = yield call(executeBet, { ...tickOffset, customerStrategyRef });
  if (bet) {
    yield call(updateCustomOrder, 'remove-bet', { rfs: tickOffset.rfs });
    yield put(removeTickOffset({ selectionId: tickOffset.selectionId }));
  }
}

export function* watchTickOffsetBet() {
  yield takeLeading('PLACE_TICK_OFFSET_BET_SAGA', placeTickOffsetBet);
}
