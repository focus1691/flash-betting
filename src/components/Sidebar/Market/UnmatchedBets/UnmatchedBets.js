import React, { useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { updateBackList } from "../../../../actions/back";
import { updateFillOrKillList } from "../../../../actions/fillOrKill";
import { updateLayList } from "../../../../actions/lay";
import { cancelOrders, updateOrders } from "../../../../actions/order";
import { updateStopEntryList } from "../../../../actions/stopEntry";
import { updateStopLossList } from "../../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../../actions/tickOffset";
import { combineUnmatchedOrders } from '../../../../utils/Bets/CombineUnmatchedOrders';
import { getPriceNTicksAway } from "../../../../utils/ladder/CreateFullLadder";
import { getMatchedBets, getUnmatchedBets } from "../../../../selectors/orderSelector";
import Bet from "./Bet";

const UnmatchedBets = ({market, marketOpen, backList, layList, stopEntryList, tickOffsetList, stopLossList, fillOrKillList, bets, matchedBets, unmatchedBets, updateBackList,
  updateLayList, updateStopEntryList, updateTickOffsetList, updateStopLossList, updateFillOrKillList, updateOrders, rightClickTicks}) => {

  const allOrders = combineUnmatchedOrders(backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched);
  const selections = useMemo(() => { return Object.keys(allOrders) }, [allOrders]);

  const cancelOrder = useCallback(async order => {
		if (order) {
      const data = await cancelOrders(order, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, order.side);
      
			updateBackList(data.back);
			updateLayList(data.lay);
			updateStopLossList(data.stopLoss);
			updateTickOffsetList(data.tickOffset);
			updateStopEntryList(data.stopEntry);
			updateFillOrKillList(data.fillOrKill);
		}
  }, [backList, fillOrKillList, layList, matchedBets, updateBackList, updateFillOrKillList, updateLayList, updateStopEntryList, updateStopLossList, updateTickOffsetList, stopEntryList, stopLossList, tickOffsetList, unmatchedBets]);

  const replaceOrderPrice = useCallback((order, newPrice) => {
    const newOrder = Object.assign({}, order, {price: newPrice})
    switch (order.strategy) {
      case "Back":
        const newBackList = Object.assign({}, backList);
        const indexBack = newBackList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newBackList[order.selectionId][indexBack].price = newPrice;
        updateBackList(newBackList);
        break;
      case "Lay":
        const newLayList = Object.assign({}, layList);
        const indexLay = newLayList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newLayList[order.selectionId][indexLay].price = newPrice;
        updateLayList(newLayList);
        break;
      case "Stop Entry":
        const newStopEntryList = Object.assign({}, stopEntryList);
        const indexStopEntry = newStopEntryList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newStopEntryList[order.selectionId][indexStopEntry].price = newPrice;
        updateStopEntryList(newStopEntryList);
        break;
      case "Tick Offset":
        const newTickOffsetList = Object.assign({}, tickOffsetList);
        newTickOffsetList[order.rfs].price = newPrice;
        updateTickOffsetList(newTickOffsetList)
        break;
      case "Stop Loss":
        const newStopLossList = Object.assign({}, stopLossList);
        newStopLossList[order.selectionId].price = newPrice;
        updateStopLossList(newStopLossList)
        break;
      case "None":
        // if we can find something that fits with the fill or kill, we can remove that too (this is because we don't make another row for fill or kill)
        if (fillOrKillList[order.betId] !== undefined) {
          const newFillOrKill = Object.assign({}, fillOrKillList)
          newFillOrKill[order.betId].price = newPrice;
          updateFillOrKillList(newFillOrKill)

        }

        fetch('/api/replace-orders', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            marketId: order.marketId,
            betId: order.betId,
            newPrice: newPrice,
            customerRef: order.rfs
          })
        })
        .then(res => res.json())
        .then(res => {
          if (res.status === "SUCCESS") {
            const newUnmatched = Object.assign({}, bets.unmatched);
            
            const newBetId = res.instructionReports[0].placeInstructionReport.betId;
            newUnmatched[newBetId] = Object.assign({}, newUnmatched[order.betId]);
            newUnmatched[newBetId].price = res.instructionReports[0].placeInstructionReport.instruction.limitOrder.price;
            newUnmatched[newBetId].betId = newBetId;

            delete newUnmatched[order.betId];

            updateOrders({
              unmatched: newUnmatched,
              matched: bets.matched,
            })
          }
        });
        break;
      default:
        break;
    }

    try {
      fetch('/api/update-order', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(newOrder)
      })
    } catch (e) {

    }
  }, [backList, bets.matched, bets.unmatched, fillOrKillList, layList, updateBackList, updateFillOrKillList, updateLayList, updateOrders, updateStopEntryList, updateStopLossList, updateTickOffsetList, stopEntryList, stopLossList, tickOffsetList]);

  const handleRightClick = order => {
    replaceOrderPrice(order, getPriceNTicksAway(parseFloat(order.price), rightClickTicks))
  }

  return (
    <div>
      <table className="menu-bets">
        <tbody>
          <tr className="menu-bets-heading">
            <button
              style={{
                height: "22px",
                width: "auto",
                backgroundColor: "transparent",
                visibility: "collapse",
                pointerEvents: "none"
              }}
            />
            <td>Odds</td>
            <td>Stake</td>
            <td>P/L</td>
          </tr>
          <tr>
            <td className="menu-bets-event" colSpan={4}>
              {market.competition !== undefined ? market.marketName + " " + market.competition.name : null}
            </td>
          </tr>
          {marketOpen
            ? selections.map(selection => {

              const selectionObject = market.runners.find(runner => runner.selectionId == selection);
              if (selectionObject === undefined) return null;

              return (
                <>
                  <tr className="menu-bets-selection" colSpan={4}>
                    <td>{selectionObject.runnerName}</td>
                  </tr>
                  {
                    Object.values(allOrders[selection]).map(rfs =>
                      rfs.map(bet => {
                        return <Bet
                                  bet={bet}
                                  handleRightClick={handleRightClick}
                                  cancelOrder={cancelOrder}
                                  marketStartTime={market.marketStartTime}
                                />
                      })
                    )
                  }
                </>
              )
            })
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list,
    bets: state.order.bets,
    rightClickTicks: state.settings.rightClickTicks,
		unmatchedBets: getUnmatchedBets(state.order.bets),
		matchedBets: getMatchedBets(state.order.bets)
  };
};

const mapDispatchToProps = { updateOrders, updateStopLossList, updateTickOffsetList, updateStopEntryList, updateLayList, updateBackList, updateFillOrKillList };

export default connect(mapStateToProps, mapDispatchToProps)(UnmatchedBets);