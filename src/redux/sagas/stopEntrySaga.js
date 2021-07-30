import crypto from 'crypto';
import { isEmpty } from 'lodash';
import { call, put, select } from 'redux-saga/effects';
import { executeBet } from '../../http/placeBets';
import updateCustomOrder from '../../http/updateCustomOrder';
import { removeMultiSelectionStopEntryBets } from '../actions/stopEntry';
import { extractStopEntryRfs, checkStopEntryTargetMet } from '../../utils/TradingStategy/StopEntry';

/**
 * 
 * @param {string} id   - selection id 
 * @param {string} ltp  - last traded price 
 */
export default function* executeStopEntry(id, ltp) {
  const stopEntry = yield select(state => state.stopEntry.list[id]);
  let targetsMet;

  if (!isEmpty(stopEntry)) {
    targetsMet = yield call(checkStopEntryTargetMet(stopEntry, ltp));
  }

  if (!isEmpty(targetsMet)) {
    for (let i = 0; i < targetsMet.length; i += 1) {
      const { rfs, marketId, selectionId, side, size, price } = targetsMet[i];
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

      yield call(executeBet, { marketId, selectionId, side, size, price, customerStrategyRef });
      yield call(updateCustomOrder, 'remove-bet', { rfs }); // Remove from database
    }
    const extractedRfs = yield call(extractStopEntryRfs, targetsMet);
    yield put(removeMultiSelectionStopEntryBets(extractedRfs));
  }
}

