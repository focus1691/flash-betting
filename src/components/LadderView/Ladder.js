import React, { useState, useRef, useEffect } from "react";
import LadderContainer from './LadderContainer'
import LadderHeader from "./LadderHeader";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import LadderRow from "./LadderRow";
import { formatPrice, ALL_PRICES } from "../../utils/ladder/CreateFullLadder";
import { getPLForRunner } from "../../utils/Bets/GetProfitAndLoss";
import GetColoredLTPList from "../../utils/ladder/GetColoredLTPList";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";

const Ladder = ({ id, runners, ladder, market, onPlaceOrder, onCancelOrder, onSelectRunner, order, swapLadders, ladderSideLeft, setLadderSideLeft,
    ladderOrderList, stopLoss, changeStopLossList, selectionMatchedBets, unmatchedBets, matchedBets, oddsHovered, setOddsHovered, ladderUnmatched, stake }) => {
    const containerRef = useRef(null);
    const listRef = useRef();
    const [listRefSet, setlistRefSet] = useState(false);

    const [isReferenceSet, setIsReferenceSet] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isLadderDown, setLadderDown] = useState(false);

    // every 1 second, checks if there is an LTP, if there is, we scroll to it and stop the interval
    useEffect(() => {
        const interval = setInterval(() => {
            const ltpIndex = Object.keys(ladder[id].fullLadder).indexOf(parseFloat(ladder[id].ltp[0]).toFixed(2));
            if (listRef.current !== null && ltpIndex !== -1) {
                listRef.current.scrollToItem(ltpIndex, 'center');
                clearInterval(interval);
                setlistRefSet(true);
            }
        }, 1000)

    }, [listRef]);

    // if the order changes, we scrollback to the ltp 
    useEffect(() => {
        const ltpIndex = Object.keys(ladder[id].fullLadder).indexOf(parseFloat(ladder[id].ltp[0]).toFixed(2));
        if (listRef.current !== undefined) {
            listRef.current.scrollToItem(ltpIndex, 'center');
        }
    }, [order]);

    const coloredLTPList = GetColoredLTPList(ladder, id)

    const placeOrder = data => {
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
            minFillSize: data.minFillSize
        });
    }

    const placeStopLossOrder = data => {
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
        });
    }
    const parsedVolume = {};
    if (ladder[id].trd) {
        ladder[id].trd.forEach(vol => {
            parsedVolume[formatPrice(vol[0])] = Math.floor(vol[1] / 100) / 10;
        });
    }

    const PL = matchedBets !== undefined ? getPLForRunner(market.marketId, parseInt(id), { matched: matchedBets }).toFixed(2) : 0;

    const { ladderLTPHedge, fullLadderWithProfit } = CalculateLadderHedge(ladder, id, selectionMatchedBets, ladderUnmatched, stake, PL);

    // gets all the bets we made and creates a size to offset
    const hedgeSize = selectionMatchedBets !== undefined ?
        selectionMatchedBets.reduce((a, b) => {
            return a + b.size;
        }, 0) : 0;

    const newStake = selectionMatchedBets !== undefined ? selectionMatchedBets.reduce((a, b) => a + (b.side === "LAY" ? -parseFloat(b.size) : parseFloat(b.size)), 0) + parseFloat(ladderLTPHedge) : 0;

    // gets all the unmatched bets and puts them in the ladder
    const selectionUnmatched = {};
    Object.values(unmatchedBets).forEach(item => {
        if (parseFloat(item.selectionId) === parseFloat(id)) {
            selectionUnmatched[item.price] = item;
        }
    });
    
    return (
        <LadderContainer
            isReferenceSet={isReferenceSet}
            order={order}
            containerRef={containerRef}
            isMoving={isMoving}
            isLadderDown={isLadderDown}
            setIsReferenceSet={setIsReferenceSet}
            runners={runners}
            ladderOrderList={ladderOrderList}
            swapLadders={swapLadders}
            setIsMoving={setIsMoving}
            setLadderDown={setLadderDown}
        >
            <LadderHeader
                selectionId={id}
                setLadderDown={setLadderDown}
                ladderLTPHedge={ladderLTPHedge}
                newStake={newStake}
                oddsHovered={oddsHovered}
            />

            <div className={"ladder"} onContextMenu={() => false}>
                <PercentageRow
                    setLadderSideLeft={setLadderSideLeft}
                    selectionId={id}
                    ladderSideLeft={ladderSideLeft}
                />
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            className="List"
                            height={height}
                            itemCount={Object.keys(ladder[id].fullLadder).length}
                            itemSize={20}
                            width={width}
                            ref={listRef}
                            style={{ paddingRight: `${listRefSet ? listRef.current.offsetWidth - listRef.current.clientWidth : -17}px` }}

                            itemData = {{
                                marketId: market.marketId, 
                                matchedBets: matchedBets, 
                                unmatchedBets: unmatchedBets,
                                ladder: fullLadderWithProfit,
                                selectionId: id,
                                placeOrder: placeOrder,
                                cancelOrder: onCancelOrder,
                                ltp: ladder[id].ltp[0],
                                ltpList: coloredLTPList,
                                stopLoss: stopLoss,
                                changeStopLossList: placeStopLossOrder,
                                hedgeSize: hedgeSize,
                                setOddsHovered: setOddsHovered,
                                volume: parsedVolume,
                                ladderSideLeft: ladderSideLeft,
                                selectionUnmatched: selectionUnmatched
                            }}
                        >
                            {LadderRow}
                        </List>
                    )}
                </AutoSizer>

            </div>
            <PriceRow selectionId={id} />
            <OrderRow selectionId={id} />
        </LadderContainer>
    );
};

export default Ladder;