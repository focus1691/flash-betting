import React from "react";
import { cancelOrderAction } from "../../actions/order";

export default ({ ltp, tv, percent, setLadderSideLeft, ladderSideLeft, onUpdateBets, marketId, selectionId, unmatchedBets, matchedBets }) => {
  
  const leftSide = ladderSideLeft.toLowerCase()

  const cancelAllOrdersOnSide = async (marketId, selectionId, side, unmatchedBets, matchedBets) => {
    const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);

    if (currentOrders) {
      // filter all the ones out that arent in the same selection or arent unmatched
      const openSelectedRunnerOrders = currentOrders.filter(order => order.selectionId === parseInt(selectionId) && (order.status === "EXECUTABLE" || order.status === "PENDING") && order.side === side)

      // this is basically calling 1 bet after another and returning the unmatched bets it gets from it
      const cancelBets = await openSelectedRunnerOrders.reduce(async (previousPromise, nextOrder) => {
        const previousCancelOrderUnmatchedBets = await previousPromise;
        return cancelOrderAction({
          marketId: nextOrder.marketId,
          betId: nextOrder.betId,
          sizeReduction: null,
          matchedBets: matchedBets,
          unmatchedBets: previousCancelOrderUnmatchedBets && previousCancelOrderUnmatchedBets.unmatched ? previousCancelOrderUnmatchedBets.unmatched : unmatchedBets,
        });
      }, Promise.resolve());

      if (cancelBets === undefined) return;

      onUpdateBets({
        unmatched: cancelBets.unmatched,
        matched: cancelBets.matched
      })
    }
  }
  
  return (
    <div className = {"percentage-row"}>
      <div colSpan={3} className={'th'}>{tv}</div>
      <div className = {"th"} style = {{cursor: 'pointer'}} onClick={() => cancelAllOrdersOnSide(marketId, selectionId, leftSide === 'lay' ? 'LAY' : 'BACK', unmatchedBets, matchedBets)}/>
      <div className = {"th"} style={{backgroundColor: leftSide == 'lay' ? "#FCC9D3" : "#BCE4FC"}}>
        {`${percent[leftSide]}%`}
      </div>
      <div className = {"th"} 
        style={{
            background:
              ltp[0] < ltp[1]
                ? "#0AFD03"
                : ltp[0] > ltp[1]
                ? "#FC0700"
                : "#FFFF00",
            cursor: 'pointer'
          }}
          onClick = {() => {
            setLadderSideLeft(ladderSideLeft === "LAY" ? "BACK" : "LAY")
          }}
          >
            {ltp[0]}
          </div>
      <div className = {"th"} style={{backgroundColor: leftSide == 'lay' ? "#BCE4FC" : "#FCC9D3"}}>
        {`${percent[leftSide === "lay" ? "back" : "lay"]}%`}</div>
      <div className = {"th"} style = {{cursor: 'pointer'}} onClick={() => cancelAllOrdersOnSide(marketId, selectionId, leftSide === 'lay' ? 'BACK' : 'LAY', unmatchedBets, matchedBets)}/>
    </div>
  )
};
