import crypto from 'crypto';
import { put, takeLatest, call } from 'redux-saga/effects';
import { executeBet } from '../../http/placeBets';
import { removeBet } from '../../http/dbHelper';
import { removeMultiSelectionStopEntryBets } from '../actions/stopEntry';
import { extractStopEntryRfs } from '../../utils/TradingStategy/StopEntry';

function* placeStopEntryBet(action) {
  const { stopEntryBetsToRemove } = action.payload;
  for (let i = 0; i < stopEntryBetsToRemove.length; i += 1) {
    const { rfs, marketId, selectionId, side, size, price } = stopEntryBetsToRemove[i];
    const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

    yield call(executeBet, { marketId, selectionId, side, size, price, customerStrategyRef });
    yield (removeBet, { rfs }); // Remove from database
  }
  const extractedRfs = yield call(extractStopEntryRfs, stopEntryBetsToRemove);
  yield put(removeMultiSelectionStopEntryBets, extractedRfs);
}

export function* watchStopEntryBet() {
  yield takeLatest('PLACE_STOP_ENTRY_BET_SAGA', placeStopEntryBet);
}
