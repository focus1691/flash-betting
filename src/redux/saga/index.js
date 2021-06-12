import { all } from 'redux-saga/effects';
import { watchStopLossBet, watchStopLossTicks } from './stopLossSagas';
import { watchTickOffsetBet } from './tickOffsetSagas';
import { watchStopEntryBet } from './stopEntrySagas';

export default function* rootSaga() {
  yield all([watchStopLossBet(), watchStopLossTicks(), watchTickOffsetBet(), watchStopEntryBet()]);
}
