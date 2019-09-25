import React, { useState, useRef, useEffect } from "react";
import LadderHeader from "./LadderHeader";
import LadderBody from "./LadderBody";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";

const Ladder = props => {
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const ltpRef = useRef(null);

  const [isReferenceSet, setIsReferenceSet] = useState(false);
  
  useEffect(() => {

    if (tableRef.current !== null && ltpRef.current !== null) {
        // delay for waiting to load
        setTimeout(() => {
            tableRef.current.scrollTop = ltpRef.current.offsetTop; 
            tableRef.current.scrollTop -= tableRef.current.clientHeight / 2; // add half the height of the table to center;
        }, 100)
    }
      
  }, [ltpRef]);
  
  const { id, runners, ladder, market, onPlaceOrder, onSelectRunner, order, resetPosition } = props;
  
  // remove adjacent LTP values
  const filteredLTPs = ladder[id].ltp[0] != undefined ? 
    ladder[id].ltp.filter((item, pos, arr) => {
        // Always keep the 0th element as there is nothing before it
        // Then check if each element is different than the one before it
        return pos === 0 || item !== arr[pos-1];
    }) : []

  return (
    <div 
        className="odds-table" 
        style={{
            left: isReferenceSet ? `${order * containerRef.current.clientWidth}px` : `0px`,
            visibility: isReferenceSet ? 'visible' : 'collapse',
        }} 
        ref = {containerRef}
        onLoad={() => {
            setIsReferenceSet(true);
        }}>
        <LadderHeader
            runner={runners[id]}
            runnerClick={e => {
                onSelectRunner(runners[id]);
            }}
            parentRef = {containerRef}
            moveLadder = {(offsetPos) => {
                containerRef.current.style.left = isReferenceSet ? `${parseInt(containerRef.current.style.left, 10) + offsetPos}px` : `0px`
                containerRef.current.style['z-index'] = 9999;
            }}
            returnToOrderedPos = {() => {
                containerRef.current.style.left = isReferenceSet ? `${order * containerRef.current.clientWidth}px` : `0px`
                containerRef.current.style['z-index'] = 0;
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
                    ltpList = {filteredLTPs}
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