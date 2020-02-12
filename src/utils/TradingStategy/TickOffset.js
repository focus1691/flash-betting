const findTickOffset = (matchedPrice, side, offset, percent=false) => {

    var i;

    const ALL_PRICES = Array(100).fill()
    .map((a, l) => parseFloat((l / 100 + 1.01).toFixed(2)))
    .concat(Array(50).fill().map((a, l) => parseFloat((l / 50 + 2.02).toFixed(2))))
    .concat(Array(20).fill().map((a, l) => parseFloat((l / 20 + 3.05).toFixed(2))))
    .concat(Array(20).fill().map((a, l) => parseFloat((l / 10 + 4.1).toFixed(1))))
    .concat(Array(20).fill().map((a, l) => parseFloat((l / 5 + 6.2).toFixed(1))))
    .concat(Array(19).fill().map((a, l) => parseFloat((l / 2 + 10.5).toFixed(1))))
    .concat(Array(11).fill().map((a, l) => parseFloat((l + 20).toFixed(0))))
    .concat(Array(10).fill().map((a, l) => parseFloat((2 * l + 32).toFixed(0))))
    .concat(Array(10).fill().map((a, l) => parseFloat((5 * l + 55).toFixed(0))))
    .concat(Array(90).fill().map((a, l) => parseFloat((10 * l + 110).toFixed(0))));

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
    
    if (percent) {

        const computedPrice = parseFloat(matchedPrice) * (1 - offset / 100);
        const closestToComputed = arr.sort((a, b) => Math.abs(computedPrice - a) - Math.abs(computedPrice - b));
        
        // takes the lowest value
        target = closestToComputed[0] < closestToComputed[1] ? closestToComputed[0] : closestToComputed[2]
        
        return { priceReached: target };
    }

    if (side === 'back') {
        for (i = arr.indexOf(matchedPrice); i <= 1000; i++) {
            target = arr[i];
            if (offset-- <= 0 || i === 1000) {
                break;
            }
        }
        
    }
    else if (side === 'lay') {
        for (i = arr.indexOf(matchedPrice); i >= 0; i--) {
            target = arr[i];
            if (offset-- <= 0 || i === 0) {
                break;
            }
        }
    }
    return { priceReached: target };
}

export { findTickOffset };