import { call, put, select, takeEvery } from 'redux-saga/effects';
import { setInitialClk, setClk, addNonRunners, loadLadder, setSortedLadder } from '../actions/market';
import { setLadderLoaded, updateLadderOrder, updateExcludedLadders } from '../actions/ladder';
import executeStopEntry from './stopEntrySaga';
import executeStopLoss from './stopLossSagas';
import { SAFE_LADDER_LIMIT } from '../../constants';

function* processMarketUpdates(action) {
  const { mc, clk, initialClk } = action.payload;

  for (let i = 0; i < mc.length; i += 1) {
    const { rc, marketDefinition } = mc[i];

    // Load each ladder individually
    for (let j = 0; j < rc.length; j += 1) {
      yield put(loadLadder(rc[j]));

      const { id, ltp } = rc[j];

      // The Last Traded Price has changed which can trigger the Stop Entry / Stop Loss
      if (ltp) {
        yield call(executeStopEntry, id, ltp);
        yield call(executeStopLoss, id, ltp);
      }
    }

    // Ladders are sorted in order of LTP after each update
    yield put(setSortedLadder());

    // A check to see if the ladders have been loaded for the first time
    const isLoaded = yield select(state => state.ladder.isLoaded);

    if (!isLoaded) {
      const sortedLadder = yield select(state => state.market.sortedLadder);
      yield put(updateLadderOrder({ ...sortedLadder }));
      yield put(updateExcludedLadders(sortedLadder.slice(SAFE_LADDER_LIMIT, sortedLadder.length)));
      yield put(setLadderLoaded());
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
