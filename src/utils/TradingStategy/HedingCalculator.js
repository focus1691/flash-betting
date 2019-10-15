
import { twoDecimalPlaces } from "../PriceCalculator";

/**
 * This function is used to calculate the total of a bet.
 * @param {string} price - The side i.e. BACK or LAY.
 * @param {number} stake - The stake.
 * @return {number} The bet total.
 */
const calcBetTotal = (price, stake) => {
    return price * stake;
};


/**
 * This function is used to calculate liability of a bet.
 * Source: https://help.smarkets.com/hc/en-gb/articles/115003381865-How-to-calculate-the-liability-of-a-lay-bet
 * @param {string} side - The side i.e. BACK or LAY
 * @param {number} backStake - The stake
 * @param {string} layOdds - Current lay odds
 * @return {number} This amount will be deducted from your balance should your bet lose
 */
const calcLiability = (side, backStake, layOdds) => {
    // When backing an outcome, the liability is your stake
    if (side === 'BACK') return backStake;

    // Calculate the lay liability
    return parseFloat(backStake * (layOdds - 1).toFixed(2));
};

const calcBackBet = (odds, stake) => {
    return stake * odds - stake;
}

const calcLayBet = (odds, stake) => {
    const backersStake = parseFloat((stake / (odds - 1)).toFixed(2));
    return {
        backersStake: backersStake,
        liability: calcLiability("LAY", backersStake, odds).toFixed(2)
    }
}

/**
 * This function is used to calculate the amount you need to place the hedged bet for.
 * @param {string} stake - The amount the bet was placed at.
 * @param {number} liability - The amount deducted from the balance if the bet loses.
 * @param {string} exitPrice - The price the bet will be exited at.
 * @return {number} The amount you need to place the bet.
 */
const calcHedgedBetAmount = (stake, liability, exitPrice) => {
    return parseFloat(((stake + liability) / exitPrice).toFixed(2));
};

/**
 * This function is used to calculate the profit/loss from a hedged position.
 * @param {string} stake - The amount the bet was placed at.
 * @param {number} liability - The amount deducted from the balance if the bet loses.
 * @param {string} exitPrice - The price the bet will be exited at.
 * @return {number} The Profit or loss.
 */
const calcHedgedPL = (stake, liability, exitPrice) => {
    return parseFloat(stake - (calcHedgedBetAmount(stake, liability, exitPrice)).toFixed(2));
};

/**
 * Another function to calculate the profit/loss from a hedged position using the back price instead of liability.
 * @param {string} stake - The amount the bet was placed at.
 * @param {number} backPrice - The odds the bet was placed at.
 * @param {string} exitPrice - The odds the bet will be exited at.
 * @return {number} The Profit or loss.
 */
const calcHedgedPL2 = (stake, backPrice, exitPrice) => {
    return parseFloat(((stake * backPrice) / exitPrice - stake).toFixed(2));
};

const netProfitOnHedge = (stake, hedgedPL) => {
    return twoDecimalPlaces(stake - hedgedPL);
  }
  

export { calcLiability, calcHedgedBetAmount, calcHedgedPL, calcHedgedPL2, twoDecimalPlaces, calcBackBet, calcLayBet };