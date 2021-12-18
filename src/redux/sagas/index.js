import { all } from 'redux-saga/effects';
import { watchMarketUpdates } from './marketUpdateSagas';
import { watchPlaceOrders } from './placeOrderSaga';
import { watchTickOffsetBet } from './tickOffsetSagas';

export default function* rootSaga() {
  yield all([
    watchMarketUpdates(),
    watchTickOffsetBet(),
    watchPlaceOrders(),
  ]);
}
