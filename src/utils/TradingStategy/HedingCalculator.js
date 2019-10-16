
import { twoDecimalPlaces } from "../PriceCalculator";

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

const calcHedge = (size, price, side, ltp, exitPrice) => {
    var PL = twoDecimalPlaces((size * price) / exitPrice);
    const PLAtLTP = calcHedgedPL2(size, price, ltp);

    return {
        hedgePL: PLAtLTP,
        hedgeStake: side === "BACK" ? PL : -PL
    }
};

/**
 * Another function to calculate the profit/loss from a hedged position using the back price instead of liability.
 * @param {string} stake - The amount the bet was placed at.
 * @param {number} backPrice - The odds the bet was placed at.
 * @param {string} exitPrice - The odds the bet will be exited at.
 * @return {number} The Profit or loss.
 */
const calcHedgedPL2 = (stake, backPrice, exitPrice) => {
    return twoDecimalPlaces(((stake * backPrice) / exitPrice - stake));
};

export { calcLiability, calcHedge, calcHedgedPL2, calcBackBet, calcLayBet };