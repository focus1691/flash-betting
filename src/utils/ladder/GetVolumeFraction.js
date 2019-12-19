export default (trd) => {
    let highest = trd.sort((a, b) => b[1] - a[1]);

    if (highest[0] === null || highest[0] === undefined) return null;
    highest = Math.floor(highest[0][1] / 100) / 10;

    if (highest < 1) return 0.01;
    if (highest >= 1 && highest < 10) return .1;
    if (highest >= 10 && highest < 100) return 1;
    if (highest >= 100 && highest < 1000) return 10;
    if (highest >= 1000 && highest < 10000) return 100;
    if (highest >= 10000 && highest < 100000) return 1000;
    if (highest >= 100000 && highest < 1000000) return 10000;
}