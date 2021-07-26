import crypto from 'crypto';
import { isEmpty } from 'lodash';
import { call, put, select } from 'redux-saga/effects';
//* Actions
import { removeStopLoss, updateStopLossTicks } from '../actions/stopLoss';
//* HTTP
import { executeBet } from '../../http/placeBets';
import { removeBet, updateTicks } from '../../http/dbHelper';
//* Utils
import calcBetPriceSize from '../../utils/Bets/CalcBetPriceSize';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { checkStopLossHit } from '../../utils/TradingStategy/StopLoss';

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

function* placeStopLossBet(id, stopLoss) {
  const { marketId, selectionId, side, price } = stopLoss;

  const selectionMatchedBets = yield select(state => Object.values(state.bets.matched).filter(({ selectionId }) => id == selectionId));
  const { size } = yield call(CalculateLadderHedge, parseFloat(price), selectionMatchedBets, 'hedged');

  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

  const data = { marketId, selectionId, side, size, price };

  const betParams = yield call(calcBetPriceSize, data);
  const bet = yield call(executeBet, { ...betParams, customerStrategyRef });
  if (bet) {
    yield call(removeBet({ rfs: betParams.rfs }));
    yield put(removeStopLoss({ selectionId: bet.selectionId }));
  }
}

function* updateStopLoss(stopLoss, ltp) {
  const { selectionId, side, rfs, trailing } = stopLoss;
  let { ticks } = stopLoss;

  const prevLTP = select(state => state.market.ladder[selectionId].ltp[1] || state.market.ladder[selectionId].ltp[0]);
  if (trailing && ((ltp < prevLTP && side === 'BACK') || (ltp > prevLTP && side === 'LAY'))) {
    ticks += 1;

    yield call(updateTicks({ rfs, ticks })); // db
    yield put(updateStopLossTicks({ selectionId, ticks })); // redux store
  }
}
