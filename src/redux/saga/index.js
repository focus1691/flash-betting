import { all } from 'redux-saga/effects';
import { watchMarketUpdates } from './marketUpdateSagas';
import { watchStopLossBet, watchStopLossTicks } from './stopLossSagas';
import { watchTickOffsetBet } from './tickOffsetSagas';

export default function* rootSaga() {
  yield all([
    watchMarketUpdates(),
    watchStopLossBet(),
    watchStopLossTicks(),
    watchTickOffsetBet(),
  ]);
}
