/** An array of all BetFair values between 1.01 to 1000
 * Used in the stop loss check function below
 */
const ALL_PRICES =
Array(100).fill().map((v,i)=> parseFloat((i/100 + 1.01).toFixed(2) ))
.concat(Array(50).fill().map((v,i)=> parseFloat((i/50 + 2.02).toFixed(2) )))
.concat(Array(20).fill().map((v,i)=> parseFloat((i/20 + 3.05).toFixed(2) )))
.concat(Array(20).fill().map((v,i)=> parseFloat((i/10 + 4.1).toFixed(1) )))
.concat(Array(20).fill().map((v,i)=> parseFloat((i/5 + 6.2).toFixed(1) )))
.concat(Array(19).fill().map((v,i)=> parseFloat((i/2 + 10.5).toFixed(1) )))
.concat(Array(11).fill().map((v,i)=> parseFloat((i + 20).toFixed(0) )))
.concat(Array(10).fill().map((v,i)=> parseFloat((i*2 + 32).toFixed(0) )))
.concat(Array(10).fill().map((v,i)=> parseFloat((i*5 + 55).toFixed(0) )))
.concat(Array(90).fill().map((v,i)=> parseFloat((i*10 + 110).toFixed(0) )))


/**
 * This function is used to calculate whether the stop loss has been triggered.
 * @param {number} size - The position of the bet e.g. £10
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} currentPrice - The current price the bet is trading at e.g. 3.15
 * @param {string} side - Back or Lay *REQUIRED*
 * @param {number} ticks - Number of ticks for the stop, or percentage of price
 * @param {string} tickOffsetStrategy - ticks field represents percent if percent is passed
 * @return {Object} {targetMet, priceReached} 
 *   User settings.
 */
const checkStopLossHit = (size, matchedPrice, currentPrice, side, ticks, tickOffsetStrategy) => {
    matchedPrice = parseFloat(matchedPrice);
    currentPrice = parseFloat(currentPrice);
  
       if (tickOffsetStrategy === 'percent') {
          let initialPL = parseFloat((size * matchedPrice - size).toFixed(2));
          let currPL = parseFloat((size * currentPrice - size).toFixed(2));
          let percentIncrease = Math.floor(Math.abs((currPL - initialPL) / initialPL * 100));
          
          console.log(initialPL, currPL);
          console.log(percentIncrease); 
  
          return { targetMet: percentIncrease > ticks, priceReached: matchedPrice };
       } 
      else if (side === 'back' && currentPrice < matchedPrice || side === 'lay' && currentPrice > matchedPrice) {
            return { targetMet: false, priceReached: matchedPrice };
      } else if (Math.abs(ALL_PRICES.indexOf(matchedPrice) - ALL_PRICES.indexOf(currentPrice)) >= ticks) {
        return { targetMet: true, priceReached: matchedPrice };
      }
      return { targetMet: false, priceReached: currentPrice };
  }

export { checkStopLossHit };