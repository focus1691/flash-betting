import { all } from 'redux-saga/effects';
import { watchMarketUpdates } from './marketUpdateSagas';
import { watchTickOffsetBet } from './tickOffsetSagas';

export default function* rootSaga() {
  yield all([
    watchMarketUpdates(),
    watchTickOffsetBet(),
  ]);
}
