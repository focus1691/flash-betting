import React, { useRef } from "react";
import { formatOdds } from "../../utils/ladder/CreateFullLadder";

export default ({ ladder, selectionId, placeOrder, ltp, ltpRef, ltpList = [] }) => {
  // TODO ltpList
  // const arr = [2.44, 2.50, 2.46, 2.62] for testing, replace ltpList with arr
  const coloredLTPList = ltpList.map((item, index) => {
    if (index === ltpList.length - 1) { // if last element
      return {
        tick: item,
        color: item > ltpList[index - 1] || index === 0 ? 'G' : 'R'
      } 
    } else {
      return {
        tick: item,
        color: item < ltpList[index + 1] ? 'R' : 'G'
      }
    }
  })

  return (
    Object.keys(ladder).map(key => {
      const indexInLTPList = coloredLTPList.findIndex(item => item.tick == key);
      return (
        <tr key={ladder[key].odds} ref = {key == ltp ? ltpRef : null}>
          <td className={"candle-stick-col"} colSpan={3}>
            {
              indexInLTPList >= 0 ? 
                <img 
                  src={`${window.location.origin}/icons/${coloredLTPList[indexInLTPList].color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                  className={"candle-stick"} alt = "" style = {{right: indexInLTPList * 2}} /> 
                : null
            }
            
          </td>
          <td>{ladder[key].backProfit}</td>
          <td
            onClick={e =>
              placeOrder({
                side: "BACK",
                price: formatOdds(ladder[key].odds),
                selectionId: selectionId
              })
            }
          >
            {ladder[key].backMatched}
          </td>
          <td>{formatOdds(ladder[key].odds)}</td>
          <td
            onClick={e => {
              placeOrder({
                side: "LAY",
                price: formatOdds(ladder[key].odds),
                selectionId: selectionId
              });
            }}
          >
            {ladder[key].layMatched}
          </td>
          <td>{ladder[key].layProfit}</td>
        </tr>
      );
    })
  )
}