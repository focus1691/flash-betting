import crypto from 'crypto';
import { put, takeLeading, call } from 'redux-saga/effects';
import { removeStopLoss, updateStopLossTicks } from '../actions/stopLoss';
import { executeBet } from '../../http/placeBets';
import { removeBet, updateTicks } from '../../http/dbHelper';
import calcBetPriceSize from '../../utils/Bets/CalcBetPriceSize';

function* placeStopLossBet(action) {
  let { betParams } = action.payload;
  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

  betParams = yield call(calcBetPriceSize, betParams);
  const bet = yield call(executeBet, { ...betParams, customerStrategyRef });
  if (bet) {
    yield call(removeBet({ rfs: betParams.rfs }));
    yield put(removeStopLoss({ selectionId: bet.selectionId }));
  }
}

function* updateStopLoss(action) {
  const { stopLoss } = action.payload;
  const { selectionId, rfs, ticks } = stopLoss;
  stopLoss.ticks += 1;
  yield call(updateTicks({ rfs, ticks: ticks + 1 })); //! Update SQLite with new ticks
  yield put(updateStopLossTicks({ selectionId, ticks: ticks + 1 }));
}

export function* watchStopLossBet() {
  yield takeLeading('PLACE_STOP_LOSS_BET_SAGA', placeStopLossBet);
}

export function* watchStopLossTicks() {
  yield takeLeading('UPDATE_STOP_LOSS_TICKS_SAGA', updateStopLoss);
}
