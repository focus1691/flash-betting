
const calcHedgeProfit = (PLHedgeNumber, side) => {
	return PLHedgeNumber && PLHedgeNumber.side === side && PLHedgeNumber.profit ? PLHedgeNumber.profit : undefined;   
}

const hedgeStyle = (unmatchedBetsOnRow, hedgePL) => {
    return { color: unmatchedBetsOnRow ? "black" : `${hedgePL >= 0 ? "green" : "red"}` }
}

export { calcHedgeProfit, hedgeStyle };