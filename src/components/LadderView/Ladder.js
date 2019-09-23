import React, { useRef, useEffect } from "react";
import LadderHeader from "./LadderHeader";
import LadderBody from "./LadderBody";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";

const Ladder = props => {
  const tableRef = useRef(null);
  const ltpRef = useRef(null);
  
  useEffect(() => {

    if (tableRef.current !== null) {
        if (ltpRef.current !== null) {
            // delay for waiting to load
            setTimeout(() => {
                tableRef.current.scrollTop = ltpRef.current.offsetTop; 
                tableRef.current.scrollTop -= tableRef.current.clientHeight / 2; // add half the height of the table to center;
            }, 100)
        }
    }
      
  }, [ltpRef]);
  

  const { id, runners, ladder, market, onPlaceOrder, onSelectRunner } = props;

  return (
    <div className="odds-table">
        <LadderHeader
            runner={runners[id]}
            runnerClick={e => {
            onSelectRunner(runners[id]);
            }}
        />

        <div className={"ladder"} ref={tableRef}>
            <table>
            <tbody>
                <PercentageRow
                    ltp={ladder[id].ltp}
                    tv={
                        ladder[id].tv[0]
                        ? ladder[id].tv[0].toLocaleString()
                        : ""
                    }
                />
                <LadderBody
                    ladder={ladder[id].fullLadder}
                    selectionId={id}
                    placeOrder={data => {
                        onPlaceOrder({
                            marketId: market.marketId,
                            side: data.side,
                            size: 5,
                            price: data.price,
                            selectionId: data.selectionId
                        });
                    }}
                    ltp = {ladder[id].ltp[0]}
                    ltpRef = {ltpRef}
                />
                <PriceRow />
            </tbody>
            </table>
        </div>
        <OrderRow />
    </div>
  );
};

export default Ladder;