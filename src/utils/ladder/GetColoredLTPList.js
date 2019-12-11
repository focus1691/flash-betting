// remove adjacent LTP values for [5.2, 4.3, 4.3] turns into [5.2, 4.3]
export default (ladder, id) => {
    const filteredLTPs =
        ladder !== undefined ?
            ladder.ltp[0] !== undefined ?
                ladder.ltp.filter((item, pos, arr) => {
                    // Always keep the 0th element as there is nothing before it
                    // Then check if each element is different than the one before it
                    return pos === 0 || item !== arr[pos - 1];
                }) : []
            : []

    const coloredLTPList = filteredLTPs.map((item, index) => {
        if (index === filteredLTPs.length - 1) { // if last element
            return {
                tick: item,
                color: item > filteredLTPs[index - 1] || index === 0 ? 'G' : 'R'
            }
        } else {
            return {
                tick: item,
                color: item < filteredLTPs[index + 1] ? 'R' : 'G'
            }
        }
    });
    return coloredLTPList
}
