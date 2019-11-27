const sortLadder = ladders => {
    return Object.keys(ladders).map(val => [ladders[val].ltp[0], val])
        .sort((a, b) => { return (!a[0]) - (!b[0]) || a[0] - b[0] })
        .map(data => data[1]);
}

const sortGreyHoundMarket = (sportId, runners) => {
    if (sportId === "4339") {
        return Object.keys(runners).map(key => [runners[key].runnerName, key]).sort().map(val => val[1]);
    }
    return [];
};

export { sortLadder, sortGreyHoundMarket };