import crypto from 'crypto';
import { isEmpty } from 'lodash';
import { call, put, select } from 'redux-saga/effects';
//* Actions
import { addStopLoss, removeStopLoss, updateStopLossTicks } from '../actions/stopLoss';
//* HTTP
import { executeBet } from '../../http/placeBets';
import updateCustomOrder from '../../http/updateCustomOrder';
//* Utils
import { getOppositeSide } from '../../utils/Bets/GetOppositeSide';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { calcStopLossPrice, checkStopLossHit } from '../../utils/TradingStategy/StopLoss';

/**
 * 
 * @param {string} id   - selection id 
 * @param {string} ltp  - last traded price 
 */
export default function* executeStopLoss(id, ltp) {
  const stopLoss = yield select(state => state.stopLoss.list[id]);

  if (!isEmpty(stopLoss)) {
    const targetMet = yield call(checkStopLossHit, stopLoss, ltp);

    if (targetMet) {
      yield call(placeStopLossBet, id, stopLoss);
    }
    else {
      yield call(updateStopLoss, stopLoss, ltp);
    }
  }
}

export function* addStopLossBet(marketId, selectionId, size, side, price, rfs, betId) {
  const { offset, units, hedged } = yield select(state => state.stopLoss);

  const SL = {
    strategy: 'Stop Loss',
    marketId,
    selectionId,
    size,
    side: getOppositeSide(side),
    price: calcStopLossPrice(price, offset, side),
    custom: false,
    units,
    ticks: offset,
    rfs,
    assignedIsOrderMatched: false,
    betId,
    hedged,
  };

  yield put(addStopLoss(SL));
  yield call(updateCustomOrder('save-bet', SL));
}

function* placeStopLossBet(id, stopLoss) {
  const { marketId, selectionId, side, price } = stopLoss;

  const selectionMatchedBets = yield select(state => Object.values(state.bets.matched).filter(({ selectionId }) => id == selectionId));
  const { size } = yield call(CalculateLadderHedge, parseFloat(price), selectionMatchedBets, 'hedged');

  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

  const betParams = { marketId, selectionId, side, size, price };

  const bet = yield call(executeBet, { ...betParams, customerStrategyRef });
  if (bet) {
    yield call(updateCustomOrder('remove-bet', { rfs: betParams.rfs }));
    yield put(removeStopLoss({ selectionId: bet.selectionId }));
  }
}

function* updateStopLoss(stopLoss, ltp) {
  const { selectionId, side, rfs, trailing } = stopLoss;
  let { ticks } = stopLoss;

  const prevLTP = select(state => state.market.ladder[selectionId].ltp[1] || state.market.ladder[selectionId].ltp[0]);
  if (trailing && ((ltp < prevLTP && side === 'BACK') || (ltp > prevLTP && side === 'LAY'))) {
    ticks += 1;

    yield call(updateCustomOrder('update-ticks', { rfs, ticks })); // db
    yield put(updateStopLossTicks({ selectionId, ticks })); // redux store
  }
}
