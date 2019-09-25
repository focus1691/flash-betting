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
  const [isMoving, setIsMoving] = useState(false);
  
  useEffect(() => {

    if (tableRef.current !== null && ltpRef.current !== null) {
        // delay for waiting to load
        setTimeout(() => {
            tableRef.current.scrollTop = ltpRef.current.offsetTop; 
            tableRef.current.scrollTop -= tableRef.current.clientHeight / 2; // add half the height of the table to center;
        }, 100)
    }
      
  }, [ltpRef]);
  
  const { id, runners, ladder, market, onPlaceOrder, onSelectRunner, order, swapLadders, ladderOrderList } = props;
  
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
            opacity: isMoving ? '0.7' : '1.0'
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
            moveLadder = {(offsetPos, cursorPosition) => {

                if (!isReferenceSet) return
                containerRef.current.style.left = `${parseInt(containerRef.current.style.left, 10) + offsetPos}px`
                containerRef.current.style['z-index'] = 9999;
                

                // filter out the current ladder
                const otherNodes = {}
                for (const key in containerRef.current.parentNode.childNodes) {
                    if (key == order + 1 || key == order - 1) { // check for only the one before and after it
                        otherNodes[key] = containerRef.current.parentNode.childNodes[key];
                    }
                }

                // find the mid way point of the other nodes
                const relativeCursorPosition = cursorPosition - containerRef.current.offsetParent.offsetLeft
                for (const key in otherNodes) {
                    const midPoint = parseInt(otherNodes[key].style.left, 10) + otherNodes[key].clientWidth / 2

                    if ((relativeCursorPosition > midPoint && order < key) || (relativeCursorPosition < midPoint && order > key)) {  // move right or left

                        // we have to find the actual id if one of the ladders are hidden

                        const thisLadderIndex = Object.values(runners).findIndex(item => item.runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim() == containerRef.current.children[0].children[0].childNodes[1].data.replace(/[0-9.]*[.,\s]/g, ' ').trim()) // ladder header -> contender name -> name 
                        const thisLadderId = Object.keys(runners)[thisLadderIndex]
                        
                        const thisLadderOrder = Object.values(ladderOrderList).findIndex(item => item == thisLadderId)
                        if (thisLadderOrder === -1) break;

                        const otherLadderIndex = Object.values(runners).findIndex(item => item.runnerName.replace(/[0-9.]*[.,\s]/g, ' ').trim() == otherNodes[key].children[0].children[0].childNodes[1].data.replace(/[0-9.]*[.,\s]/g, ' ').trim()) // ladder header -> contender name -> name 
                        const otherLadderId = Object.keys(runners)[otherLadderIndex]
                        
                        const otherLadderOrder = Object.values(ladderOrderList).findIndex(item => item == otherLadderId)
                        if (otherLadderOrder === -1) break;

                        swapLadders(order, otherLadderOrder);

                        otherNodes[key].style.left = `${order * containerRef.current.clientWidth}px`
                        
                        break;   
                    }
                }

                setIsMoving(true);
                
            }}
            returnToOrderedPos = {() => {
                if (!isReferenceSet) return
                containerRef.current.style.left = `${order * containerRef.current.clientWidth}px`
                containerRef.current.style['z-index'] = 0;
                setIsMoving(false);
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