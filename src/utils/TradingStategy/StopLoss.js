import { calcPercentDifference } from "../Bets/BettingCalculations";
import { ALL_PRICES } from "../ladder/CreateFullLadder";

/**
 * This function is used to calculate whether the stop loss has been triggered.
 * @param {number} size - The position of the bet e.g. £10
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} currentPrice - The current price the bet is trading at e.g. 3.15
 * @param {string} side - Back or Lay *REQUIRED*
 * @param {number} ticks - Number of ticks for the stop, or percentage of price
 * @param {string} tickOffsetStrategy - ticks field represents percent if percent is passed
 * @param {boolean} betAssociated - Whether there is a bet associated with the stoploss or not
 * @return {Object} {targetMet, priceReached or stopPrice}
 */
const checkStopLossHit = (size, matchedPrice, currentPrice, side, ticks, tickOffsetStrategy, betAssociated) => {

	// We turn the prices into floating point numbers in case strings are passed
    matchedPrice = parseFloat(matchedPrice);
    currentPrice = parseFloat(currentPrice);
  
  if ((side === 'back' && currentPrice < matchedPrice) || (side === 'lay' && currentPrice > matchedPrice)) {
		// The price is trading in our favour so no need for further checks
		return { targetMet: false, priceReached: findStopPosition(matchedPrice, ticks, side, tickOffsetStrategy) };
	}
	// Percent is passed so we look at the percentage lost
	else if (tickOffsetStrategy === 'percent') {
    let percentIncrease = calcPercentDifference(size, matchedPrice, currentPrice);
		return { targetMet: percentIncrease > ticks, stopPrice: findStopPositionForPercent(size, matchedPrice, ticks, side) };
  }
  // If it's a right click, we do a comparison since there is no bet associated with it
  else if (((side === 'back' && currentPrice > matchedPrice) || (side === 'lay' && currentPrice < matchedPrice)) && !betAssociated) {

    return { targetMet: true, priceReached: findStopPosition(matchedPrice, ticks, side, tickOffsetStrategy) };
  }
	// Check if the tick offset has been satisfied by checking the price difference
	// between the matched and current prices, by finding the absolute value of their indexes
	else if (Math.abs(ALL_PRICES.indexOf(matchedPrice) - ALL_PRICES.indexOf(currentPrice)) >= ticks) {
    return { targetMet: true, priceReached: findStopPosition(matchedPrice, ticks, side, tickOffsetStrategy) };
  }
	// Target not met
	return { targetMet: false, priceReached: findStopPosition(matchedPrice, ticks, side, tickOffsetStrategy) };
}

/**
 * This function is used to calculate the position of the stop loss.
 * For example a matched price of 2.02 for the lay side with a stop loss
 * with 5 ticks would return 1.96 = 2.02 > 2.00 > 1.99 > 1.98 > 1.97 > 1.96
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} ticks - Number of ticks for the stop, or percentage of price
 * @param {string} side - Back or Lay *REQUIRED*
 * @return {Object} {targetMet, priceReached} 
 */
const findStopPosition = (matchedPrice, ticks, side) => {
	matchedPrice = parseFloat(matchedPrice);

  const index = Math.floor(ALL_PRICES.indexOf(matchedPrice) + (side === 'back' ? +ticks : -ticks));

	return parseFloat(ALL_PRICES[index]).toFixed(2);
}

/**
 * This function is used to calculate the position of the stop loss for percentages.
 * @param {number} size - The position of the bet e.g. £10
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} percent - The current percent loss to stop the trade at
 * @param {string} side - Back or Lay *REQUIRED*
 * @return {string} The price at which the trade will stop
 */
const findStopPositionForPercent = (size, matchedPrice, percent, side) => {
  matchedPrice = parseFloat(matchedPrice);
  var i;

  if (side === "back") {
    for (i = ALL_PRICES.indexOf(matchedPrice); i <= 1000; i++) {
      let percentIncrease = calcPercentDifference(size, matchedPrice, ALL_PRICES[i]);

      if (percentIncrease >= percent) {
        return ALL_PRICES[i].toFixed(2);
      }
    }
  }
  else if (side === "lay") {
    for (i = ALL_PRICES.indexOf(matchedPrice); i >= 0; i--) {
      let percentIncrease = calcPercentDifference(size, matchedPrice, ALL_PRICES[i]);

      if (percentIncrease >= percent) {
        return ALL_PRICES[i].toFixed(2);
      }
    }
  }
	return matchedPrice.toFixed(2);
}


export { checkStopLossHit, findStopPosition, findStopPositionForPercent };