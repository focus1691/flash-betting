const sortLadder = ladders => {
    return Object.keys(ladders).map(val => [ladders[val].ltp[0], val])
        .sort((a, b) => { return (!a[0]) - (!b[0]) || a[0] - b[0] })
        .map(data => data[1]);

}

export { sortLadder };