import { isEmpty } from 'lodash';
import { call, put, select, takeEvery } from 'redux-saga/effects';
//* Actions
import {
  setInitialClk,
  setClk,
  setMarketStatus,
  setInPlay,
  setInPlayTime,
  addNonRunners,
  loadLadder,
  loadRunnerResults,
  setSortedLadder,
  closeMarket,
} from '../actions/market';
import { setLadderLoaded, updateLadderOrder, updateExcludedLadders } from '../actions/ladder';
//* Sagas
import executeStopEntry from './stopEntrySaga';
import executeStopLoss from './stopLossSagas';
import { SAFE_LADDER_LIMIT } from '../../constants';
//* HTTP
import fetchData from '../../http/fetchData';

function* processMarketDefinition(marketDefinition) {
  console.log('market definition', marketDefinition);
  const { runners, inPlay, status, marketTime } = marketDefinition;

  if (runners) {
    const nonRunners = yield runners.filter(({ status }) => status === 'REMOVED');
    yield put(addNonRunners(nonRunners));
  }

  yield put(setMarketStatus(status));
  yield put(setInPlay(inPlay));

  const inPlayTime = yield select(state => state.market.inPlayTime);
  const marketId = yield select(state => state.market.marketId);

  if (!inPlayTime && inPlay) {
    // Start the in-play clock once we get the 'in play' signal
    yield put(setInPlayTime(new Date(marketTime)));
  }

  if (status === 'CLOSED') {
    yield put(closeMarket());
    const marketBook = yield call(fetchData, `/api/list-market-book?marketId=${marketId}`);

    if (!isEmpty(marketBook)) {
      const { runners } = marketBook[0];
      // Load the runner results
      yield put(loadRunnerResults(runners));
    }
  }
}

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

    if (marketDefinition) {
      yield call(processMarketDefinition, marketDefinition);
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

  if (initialClk) yield put(setInitialClk(initialClk));
  if (clk) yield put(setClk(clk));
}

export function* watchMarketUpdates() {
  yield takeEvery('PROCESS_MARKET_UPDATES', processMarketUpdates);
}
