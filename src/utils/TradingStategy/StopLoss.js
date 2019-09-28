const checkStopLossHit = (matchedPrice, currentPrice, side, tickOffset) => {

    var target = matchedPrice;
    var targetMet = false;
  
    if (side === 'back') {
      console.log(arr.indexOf(matchedPrice));
      for (var i = arr.indexOf(matchedPrice); i < 1000; i++) {
        target = arr[i];
  
        if (tickOffset-- <= 0) {
          break;
        }
      }
    }
    else if (side === 'lay') {
      for (var i = arr.indexOf(matchedPrice); i > 0; i--) {
        target = arr[i];
  
        if (tickOffset-- <= 0) {
          break;
        }
      }
    }
    return { targetMet: targetMet, priceReached: target };
  }

  export { checkStopLossHit };