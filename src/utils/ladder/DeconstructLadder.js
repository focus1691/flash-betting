import { isEmpty } from 'lodash';
import { sortAsc, sortDes } from '../Sort';

const getLTPstyle = (ltp) => {
  if (!ltp || !ltp[0]) {
    return { background: '#FFF', color: '#000' };
  }

  if (ltp[0] < ltp[1]) {
    return { background: '#BD2B32', color: '#d3d44f' }; // #BD2B32 (Red Lower LTP)
  }
  if (ltp[0] > ltp[1]) {
    return { background: '#0BBF63', color: '#121212' }; // #0BBF63 (Green Higher LTP)
  }
  if (ltp[0]) {
    return { background: '#d3d44f', color: '#121212' }; // #d3d44f (Yellow Same LTP)
  }
  return { background: '#FFF', color: '#121212' }; // #FFF (No Value)
};

const emptyLadder = {
  ltp: [null, null],
  tv: 0,
  color: '#FFFFFF',
  atb: {},
  atl: {},
  ltpStyle: { background: '#FFF', color: '#000' },
};

const deconstructAvailableToBack = (atb) => {
  if (isEmpty(atb)) return [];
  const sortedAtb = sortDes(Object.keys(atb)).map((v => [Number(v), atb[v]]));
  return sortedAtb;
};

const deconstructAvailableToLay = (atl) => {
  if (isEmpty(atl)) return [];
  const sortedAtl = sortAsc(Object.keys(atl)).map((v => [Number(v), atl[v]]));
  return sortedAtl;
};

/**
 * This function is used to deconstruct the ladder data when mapping through ladders
 * @param {object} ladder - Ladder information for a runner
 * @return {data} The deconstructed ladder
 */
const DeconstructLadder = (ladder) => {
  if (ladder === null || ladder === undefined) return emptyLadder;

  const deconstructedLadder = {
    ltp: !isEmpty(ladder.ltp) && ladder.ltp[0] ? ladder.ltp[0] : null,
    ltpPrev: !isEmpty(ladder.ltp) && ladder.ltp[1] ? ladder.ltp[1] : null, 
    tv: ladder.tv ? ladder.tv : null,
    color: '#FFFFFF',
    ltpStyle: getLTPstyle(ladder.ltp),
    atb: deconstructAvailableToBack(ladder.atlo),
    atl: deconstructAvailableToLay(ladder.atbo),
  }

  return deconstructedLadder;
};

export { DeconstructLadder, getLTPstyle };
