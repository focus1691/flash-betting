export default (unmatchedBetsOnRow => {
	if (unmatchedBetsOnRow) {
		return unmatchedBetsOnRow.reduce(function(acc, bet) {
			return parseFloat(acc) + parseFloat(bet.size);
		}, 0);
	} else {
        return 0;
    }
});