const getTotalMatched = (cellMatched, cellUnmatched) => {
	let totalMatched = 0;
	if (cellMatched.matched) {
		totalMatched += cellMatched.matched;
	}
	if (cellUnmatched) {
		totalMatched += cellUnmatched.reduce(function (acc, bet) {
			return parseFloat(acc) + parseFloat(bet.size);
		}, 0);
	}
	return totalMatched;
};

const orderStyle = (side, stopLoss, cellMatched, totalMatched) => {
	if (stopLoss) return { background: "yellow" };
	else if (cellMatched.side === "BACK" && totalMatched > 0 && side) return { background: "#75C2FD" };
	else if (cellMatched.side === "LAY" && totalMatched > 0 && side === "LAY") return { background: "#F694AA" };
	else if (side === "LAY") return { background: "#FCC9D3" };
	else if (side === "BACK") return { background: "#BCE4FC" };
	return null;
};

const textForOrderCell = (stopLoss, totalMatched) => {
	if (stopLoss) {
		if (stopLoss.stopLoss) {
			if (stopLoss.stopLoss.hedged) return "H";
			else return stopLoss.stopLoss.size;
		}
	}
	else if (totalMatched > 0) return totalMatched;
	return null
};

const getMatchedSide = firstCol => {
	return {
		left: firstCol ? "LAY" : "BACK",
		right: firstCol ? "BACK" : "LAY"
	}
};

export { getTotalMatched, textForOrderCell, orderStyle, getMatchedSide };