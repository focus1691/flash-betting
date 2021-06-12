import { all } from 'redux-saga/effects';
import { watchStopLossBet, watchStopLossTicks } from './stopLossSagas';

export default function* rootSaga() {
  yield all([watchStopLossBet(), watchStopLossTicks()]);
}
