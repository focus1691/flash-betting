const checkStopLossHit = (matchedPrice, currentPrice, side, tickOffset) => {

    var target = matchedPrice;
    var targetMet = false;

    if (side === 'back') {
        for (var i = arr.indexOf(matchedPrice); i <= 1000; i++) {
            target = arr[i];
            if (tickOffset-- <= 0 || i === 1000) {
                targetMet = true;
                break;
            }
        }
    }
    else if (side === 'lay') {
        for (var i = arr.indexOf(currentPrice); i >= 0; i--) {
            target = arr[i];
            if (tickOffset-- <= 0 || i === 0) {
                targetMet = true;
                break;
            }
        }
    }
    return { targetMet: targetMet, priceReached: target };
}

export { checkStopLossHit };