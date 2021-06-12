import { all } from 'redux-saga/effects';
import { watchStopLossBet, watchStopLossTicks } from './stopLossSagas';
import { watchTickOffsetBet } from './tickOffsetSagas';

export default function* rootSaga() {
  yield all([watchStopLossBet(), watchStopLossTicks(), watchTickOffsetBet()]);
}
