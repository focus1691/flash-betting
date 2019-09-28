const checkStopLossHit = (matchedPrice, currentPrice, side, tickOffset) => {

    var arr =
    Array(100).fill().map((v,i)=> (i/100 + 1.01).toFixed(2) )
    .concat(Array(50).fill().map((v,i)=> (i/50 + 2.02).toFixed(2) ))
    .concat(Array(20).fill().map((v,i)=> (i/20 + 3.05).toFixed(2) ))
    .concat(Array(20).fill().map((v,i)=> (i/10 + 4.1).toFixed(1) ))
    .concat(Array(20).fill().map((v,i)=> (i/5 + 6.2).toFixed(1) ))
    .concat(Array(19).fill().map((v,i)=> (i/2 + 10.5).toFixed(1) ))
    .concat(Array(11).fill().map((v,i)=> (i + 20).toFixed(0) ))
    .concat(Array(10).fill().map((v,i)=> (i*2 + 32).toFixed(0) ))
    .concat(Array(10).fill().map((v,i)=> (i*5 + 55).toFixed(0) ))
    .concat(Array(90).fill().map((v,i)=> (i*10 + 110).toFixed(0) ))

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