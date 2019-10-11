import React, { useState, useRef, useEffect, createRef } from "react";
import LadderContainer from './LadderContainer'
import LadderHeader from "./LadderHeader";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import LadderRow from "./LadderRow";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { calcHedgedPL, calcLiability } from "../../utils/TradingStategy/HedingCalculator";

const Ladder = ({ id, runners, ladder, market, onPlaceOrder, onSelectRunner, order, swapLadders, ladderOrderList, stopLoss, changeStopLossList, selectionMatchedBets, unmatchedBets, matchedBets }) => {
    const containerRef = useRef(null);
    const listRef = useRef();
    const [listRefSet, setlistRefSet] = useState(false);

    const [isReferenceSet, setIsReferenceSet] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isLadderDown, setLadderDown] = useState(false);
  
    useEffect(() => {
        const interval = setInterval(() => {
            const ltpIndex = Object.keys(ladder[id].fullLadder).indexOf(parseFloat(ladder[id].ltp[0]).toFixed(2));
            if (listRef.current !== null && ltpIndex !== -1) {
                listRef.current.scrollToItem(ltpIndex, 'center')
                clearInterval(interval)
                setlistRefSet(true)
            } 
        }, 1000)
        
    }, [listRef]);

    useEffect(() => {
        if (listRef.current !== undefined) {
            listRef.current.scrollToItem(0)
        }
    }, [order])

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

    const coloredLTPList = filteredLTPs.map((item, index) => {
        if (index === filteredLTPs.length - 1) { // if last element
            return {
            tick: item,
            color: item > filteredLTPs[index - 1] || index === 0 ? 'G' : 'R'
            } 
        } else {
            return {
            tick: item,
            color: item < filteredLTPs[index + 1] ? 'R' : 'G'
            }
        }
    })


    const fullLadderWithProfit = {};
    Object.values(ladder[id].fullLadder).map(item => {
        // if lay, flip
        fullLadderWithProfit[item.odds] = {...item}

        if (selectionMatchedBets !== undefined) {
            const profitArray = selectionMatchedBets.map(bet => calcHedgedPL(parseFloat(bet.size), calcLiability(bet.side === "BACK" ? "LAY" : "BACK", parseFloat(bet.size), parseFloat(bet.price)), parseFloat(item.odds)));
            const profit = (-1 * profitArray.reduce((a, b) => a + b, 0)).toFixed(2);
            
            fullLadderWithProfit[item.odds]['backProfit'] = profit
        }
    })
    const hedgeSize = selectionMatchedBets !== undefined ?
        selectionMatchedBets.reduce((a, b) => {
            // console.log(a, b)
            return a + b.size
        }, 0) : 0
    
    
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
                sportId={market.eventType.id}
                runner={runners[id]}
                runnerClick={e => {
                    onSelectRunner(runners[id]);
                }}
                setLadderDown = {setLadderDown}
            />
            
            <div className={"ladder"} onContextMenu = { () => false }>
                <PercentageRow
                    ltp={ladder[id].ltp}
                    tv={
                        ladder[id].tv[0]
                        ? ladder[id].tv[0].toLocaleString()
                        : ""
                    }
                    percent={ladder[id].percent}
                />
                    <AutoSizer>
                        {({ height, width }) => (
                        <List
                            className="List"
                            height={height}
                            itemCount={Object.keys(ladder[id].fullLadder).length}
                            itemSize={20}
                            width={width}
                            ref = {listRef}
                            style = {{paddingRight: `${listRefSet ? listRef.current.offsetWidth - listRef.current.clientWidth : -17}px`}}
                            hedgeSize = {hedgeSize}
                            itemData = {{
                                ladder: fullLadderWithProfit,
                                selectionId: id,
                                placeOrder: data => {
                                    onPlaceOrder({
                                        marketId: market.marketId,
                                        side: data.side,
                                        size: data.size,
                                        price: data.price,
                                        selectionId: data.selectionId,
                                        customerStrategyRef: data.customerStrategyRef,
                                        orderCompleteCallBack: data.orderCompleteCallBack,
                                        unmatchedBets: unmatchedBets,
                                        matchedBets: matchedBets,
                                    });
                                },
                                ltp: ladder[id].ltp[0],
                                ltpList: coloredLTPList,
                                stopLoss: stopLoss,
                                changeStopLossList: data => {
                                    changeStopLossList({
                                        marketId: market.marketId,
                                        selectionId: parseInt(id),
                                        side: data.side,
                                        size: data.size,
                                        price: data.price, 
                                        trailing: false,
                                        customStopLoss: data.custom, 
                                        units: data.units,
                                        rfs: data.rfs,
                                        assignedIsOrderMatched: data.assignedIsOrderMatched,
                                        betId: data.betId,
                                        hedged: data.hedged
                                    })
                                },
                            }}
                        >
                            {LadderRow}
                        </List>
                        )}
                    </AutoSizer>
                    
            </div>
            <PriceRow />
            <OrderRow />
        </LadderContainer>
    );


  

};

export default Ladder;

