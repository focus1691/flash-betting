
import { call, put, select } from 'redux-saga/effects';
//* Actions
import { addFillOrKill } from '../actions/fillOrKill';
//* HTTP
import updateCustomOrder from '../../http/updateCustomOrder';


export function* addFillOrKillBet(marketId, selectionId, size, side, price, rfs, betId) {
  const fillOrKillSeconds = yield select(state => state.fillOrKill.seconds);

  const FOK = {
    strategy: 'Fill Or Kill',
    marketId,
    selectionId,
    side,
    seconds: fillOrKillSeconds,
    startTime: Date.now(),
    betId,
    rfs,
  };

  yield put(addFillOrKill(FOK));
  yield call(updateCustomOrder('save-bet', FOK));
}
