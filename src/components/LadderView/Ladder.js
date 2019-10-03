import React, { useState, useRef, useEffect } from "react";
import LadderContainer from './LadderContainer'
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
  const [isLadderDown, setLadderDown] = useState(false);

  useEffect(() => {

    if (tableRef.current !== null) {
            // delay for waiting to load
            const interval = setInterval(() => {
                if (ltpRef.current !== null) {
                    tableRef.current.scrollTop = ltpRef.current ? ltpRef.current.offsetTop : 0; 
                    tableRef.current.scrollTop -= tableRef.current.clientHeight / 2; // add half the height of the table to center;
                    clearInterval(interval)
                } else {
                    
                }
            }, 100)
    }
      
  }, [ltpRef]);
  
  const { id, runners, ladder, market, onPlaceOrder, onSelectRunner, order, swapLadders, ladderOrderList, stopLoss, changeStopLossList } = props;
  // remove adjacent LTP values
  const filteredLTPs = 
  ladder[id] !== undefined ? 
    ladder[id].ltp[0] !== undefined ? 
        ladder[id].ltp.filter((item, pos, arr) => {
            // Always keep the 0th element as there is nothing before it
            // Then check if each element is different than the one before it
            return pos === 0 || item !== arr[pos-1];
        }) : [] 
    : []
  return (
    <LadderContainer
        isReferenceSet = {isReferenceSet}
        order = {order}
        containerRef = {containerRef}
        isMoving = {isMoving}
        isLadderDown = {isLadderDown}
        setIsReferenceSet = {setIsReferenceSet}
        runners = {runners}
        ladderOrderList = {ladderOrderList}
        swapLadders = {swapLadders}
        setIsMoving = {setIsMoving}
        setLadderDown = {setLadderDown}
    >
        <LadderHeader
            runner={runners[id]}
            runnerClick={e => {
                onSelectRunner(runners[id]);
            }}
            setLadderDown = {setLadderDown}
        />

        <div className={"ladder"} ref={tableRef} onContextMenu = { () => false }>
            <table onContextMenu = { (e) => { e.preventDefault(); return false } }>
                <tbody onContextMenu = { (e) => { e.preventDefault(); return false } }>
                    <PercentageRow
                        ltp={ladder[id].ltp}
                        tv={
                            ladder[id].tv[0]
                            ? ladder[id].tv[0].toLocaleString()
                            : ""
                        }
                        percent={ladder[id].percent}
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
                                selectionId: data.selectionId,
                                customerStrategyRef: data.customerStrategyRef,
                                orderCompleteCallBack: data.orderCompleteCallBack
                            });
                        }}
                        ltp = {ladder[id].ltp[0]}
                        ltpRef = {ltpRef}
                        ltpList = {filteredLTPs}
                        stopLoss = {stopLoss}
                        changeStopLossList = {data => {
                            changeStopLossList({
                                marketId: market.marketId,
                                selectionId: parseInt(id),
                                side: data.side,
                                size: 5,
                                matchedPrice: data.price, 
                                trailing: false,
                                customStopLoss: data.custom, 
                                units: data.units,
                                rfs: data.rfs,
                                assignedIsOrderMatched: data.assignedIsOrderMatched
                            })
                        }}
                    />
                    <PriceRow />
                </tbody>
            </table>
        </div>
        <OrderRow />
    </LadderContainer>
  );


  

};

export default Ladder;

