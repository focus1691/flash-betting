
import { twoDecimalPlaces } from "../Bets/BettingCalculations";
import { getOppositeSide } from "../Bets/GetOppositeSide";

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

const calcHedgeStake = (size, price, exitPrice, side) => {
    const PL = twoDecimalPlaces((size * price) / exitPrice);
    return side === "BACK" ? PL : -PL
};

const calcHedge = (size, price, side, ltp, exitPrice) => {
    return {
        hedgePL: calcHedgedPL2(size, price, ltp),
        hedgeStake: calcHedgeStake(size, price, exitPrice, side)
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

const getHedgedBets = (betsToMake, ltp) => {
    return betsToMake.map(bets =>
        bets.reduce(({ stake }, { price, size, side, selectionId }) => ({
            buyPrice: ltp[selectionId],
            stake: twoDecimalPlaces(stake + calcHedgeStake(size, price, ltp[selectionId], side)),
            side: getOppositeSide(side),
            selectionId: selectionId
        }), { prices: [], stake: [] }))
};

const getHedgedBetsToMake = (marketId, bets, ltps) => {

    const selections = Object.values(bets.matched).reduce((acc, cur) =>
        acc.indexOf(cur.selectionId) === -1 ? acc.concat(cur.selectionId) : acc, []);

    var betsToMake = selections.map(selection => {
        if (isHedgingOnSelectionAvailable(marketId, selection, bets)) {

            return Object.values(bets.matched)
                .filter(bet => bet.marketId === marketId && bet.selectionId == selection)
        }
    }).filter(selection => selection !== undefined);


    return getHedgedBets(betsToMake, ltps);
};

const isHedgingOnSelectionAvailable = (marketId, selectionId, bets) => {
    const counter = [0, 0];

    Object.values(bets.matched)
        .filter(bet => bet.marketId === marketId && bet.selectionId == selectionId)
        .map(bet => {
            switch (bet.side) {
                case "BACK":
                    counter[0]++;
                    break;
                case "LAY":
                    counter[1]++;
                    break;
                default:
                    break;
            }
        });
    return counter[0] > 0 && counter[1] === 0 || counter[0] === 0 && counter[1] > 0;
};

export { calcLiability, calcHedge, calcHedgedPL2, calcBackBet, calcLayBet, isHedgingOnSelectionAvailable, getHedgedBetsToMake, getHedgedBets };