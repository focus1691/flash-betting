import { put, takeEvery } from 'redux-saga/effects';
import { setInitialClk, setClk, addNonRunners, loadLadder } from '../actions/market';

function* processMarketUpdates(action) {
  const { mc, clk, initialClk } = action.payload;

  for (let i = 0; i < mc.length; i += 1) {
    const { rc, marketDefinition } = mc[i];

    // Load each ladder individually
    for (let j = 0; j < rc.length; j += 1) {
      yield put(loadLadder(rc[j]));
    }

    // Remove the non-runners
    if (marketDefinition && marketDefinition.runners) {
      const nonRunners = yield marketDefinition.runners.filter(({ status }) => status === 'REMOVED');
      yield put(addNonRunners(nonRunners));
    }
  }

  if (initialClk) yield put(setInitialClk(initialClk));
  if (clk) yield put(setClk(clk));
}

export function* watchMarketUpdates() {
  yield takeEvery('PROCESS_MARKET_UPDATES', processMarketUpdates);
}
