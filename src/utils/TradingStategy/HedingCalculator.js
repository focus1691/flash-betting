import { twoDecimalPlaces } from '../Bets/BettingCalculations';
import { getOppositeSide } from '../Bets/GetOppositeSide';

// eslint-disable-next-line no-extend-native
Number.prototype.round = function (places) {
  return +(`${Math.round(`${this}e+${places}`)}e-${places}`);
};

/**
 * This function is used to calculate liability of a bet.
 * Source: https://help.smarkets.com/hc/en-gb/articles/115003381865-How-to-calculate-the-liability-of-a-lay-bet
 * @param {string} side - The side i.e. BACK or LAY
 * @param {number} backStake - The stake
 * @param {string} layOdds - Current lay odds
 * @return {number} This amount will be deducted from your balance should your bet lose
 */
const calcLiability = (side, backerStake, layOdds) => {
  // When backing an outcome, the liability is your stake
  if (side === 'BACK') return backerStake;

  // Calculate the lay liability
  return (backerStake * (layOdds - 1)).round(2);
};

const calcBackBet = (odds, stake) => stake * odds - stake;

const calcHedgeStake = (size, price, exitPrice, side) => {
  const PL = twoDecimalPlaces((size * price) / exitPrice);
  return side === 'BACK' ? PL : -PL;
};

/**
 * Another function to calculate the profit/loss from a hedged position using the back price instead of liability.
 * @param {string} stake - The amount the bet was placed at.
 * @param {number} backPrice - The odds the bet was placed at.
 * @param {string} exitPrice - The odds the bet will be exited at.
 * @return {number} The Profit or loss.
 */
 const calculateHedgeProfit = (stake, backPrice, exitPrice) => ((stake * backPrice) / exitPrice - stake);

const calcHedge = (size, price, side, ltp, exitPrice) => ({
  hedgePL: calculateHedgeProfit(size, price, ltp),
  hedgeStake: calcHedgeStake(size, price, exitPrice, side),
});

const calcHedgeAtLTP = (bets, ltp) => {
  const arr = bets.map(
    (bet) => (bet.side === 'LAY' ? -1 : 1) * calculateHedgeProfit(parseFloat(bet.size), parseFloat(bet.price), parseFloat(ltp)),
  );
  return (-1 * arr.reduce((a, b) => a - b, 0)).toFixed(2);
};

const getHedgedBets = (betsToMake, ltp) => betsToMake.map((bets) => bets.reduce(({ stake }, {
  price, size, side, selectionId,
}) => ({
  buyPrice: ltp[selectionId],
  stake: twoDecimalPlaces(stake + calcHedgeStake(size, price, ltp[selectionId], side)),
  side: getOppositeSide(side),
  selectionId,
}), { prices: [], stake: [] }));

const getHedgedBetsToMake = (marketId, bets, ltps) => {
  const selections = Object.values(bets.matched).reduce((acc, cur) => (acc.indexOf(cur.selectionId) === -1 ? acc.concat(cur.selectionId) : acc), []);

  const betsToMake = selections.map((selection) => {
      return Object.values(bets.matched).filter((bet) => bet.marketId == marketId && bet.selectionId == selection);
  }).filter((selection) => selection !== undefined);

  return getHedgedBets(betsToMake, ltps);
};

export {
  calcLiability, calcHedge, calculateHedgeProfit, calcBackBet, getHedgedBetsToMake, getHedgedBets, calcHedgeAtLTP,
};
