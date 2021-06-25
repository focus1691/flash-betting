import { delay, put, takeEvery } from 'redux-saga/effects';
import { HALF_SECOND } from '../../constants/index';

function* processMarketUpdates(action) {
  const { mc, clk, initialClk } = action.payload;

  const { ltp, tv, atb, atl, trd } = mc;

  if (ltp) {
    // Update the last traded price
    yield put();
  }
  if (tv) {
    // Update the trade volume
    yield put();
  }
  if (atb) {

  }

  if (atl) {

  }

  if (trd) {

  }

  if (clk) {
    
  }

  if (initialClk) {

  }
  
  // We delay for half a second after the update
  // This is to be sure if there are frequent updates,
  // they are throttled so as to not crash and cause render lag
  yield delay(HALF_SECOND);
}

export function* watchMarketUpdates() {
  yield takeEvery('PROCESS_MARKET_UPDATES', processMarketUpdates);
}