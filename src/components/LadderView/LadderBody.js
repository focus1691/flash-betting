import React, { useRef } from "react";
import { formatOdds } from "../../utils/ladder/CreateFullLadder";

export default ({ ladder, selectionId, placeOrder, ltp, ltpRef }) => {


  return (
    Object.keys(ladder).map(key => {
      return (
        <tr key={ladder[key].odds} ref = {key == ltp ? ltpRef : null}>
          <td className={"candle-stick-col"} colSpan={2}>
            <img src={`${window.location.origin}/icons/green-candle.png`} />
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