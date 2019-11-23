import React, { useState, useRef, useEffect } from "react";
import LadderContainer from './LadderContainer'
import LadderHeader from "./LadderHeader";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import LadderRow from "./LadderRow";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { calcHedgedPL2 } from "../../utils/TradingStategy/HedingCalculator";
import { getPLForRunner } from "../../utils/Bets/GetProfitAndLoss";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";

const Ladder = ({ id, runners, ladder, market, onPlaceOrder, onSelectRunner, order, swapLadders, ladderSideLeft, setLadderSideLeft,
    ladderOrderList, stopLoss, changeStopLossList, selectionMatchedBets, unmatchedBets, matchedBets, oddsHovered, setOddsHovered, ladderUnmatched, stake }) => {
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
        const ltpIndex = Object.keys(ladder[id].fullLadder).indexOf(parseFloat(ladder[id].ltp[0]).toFixed(2));
        if (listRef.current !== undefined) {
            listRef.current.scrollToItem(ltpIndex, 'center')
        }
    }, [order])

    // remove adjacent LTP values
    const filteredLTPs =
        ladder[id] !== undefined ?
            ladder[id].ltp[0] !== undefined ?
                ladder[id].ltp.filter((item, pos, arr) => {
                    // Always keep the 0th element as there is nothing before it
                    // Then check if each element is different than the one before it
                    return pos === 0 || item !== arr[pos - 1];
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
    });

    const PL = matchedBets !== undefined ? getPLForRunner(market.marketId, parseInt(id), { matched: matchedBets }).toFixed(2) : 0

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
        })
    }
    const parsedVolume = {};
    ladder[id].trd.map(vol => { return parsedVolume[formatPrice(vol[0])] = Math.floor(vol[1] / 100) / 10 });

    const fullLadderWithProfit = {};
    let ladderLTPHedge = 0;

    Object.values(ladder[id].fullLadder).map(item => {
        // if lay, flip
        fullLadderWithProfit[item.odds] = { ...item }

        if (selectionMatchedBets !== undefined && ladderUnmatched === "hedged") {
            const profitArray = selectionMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(item.odds)));
            const profit = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

            if (parseFloat(item.odds).toFixed(2) == parseFloat(ladder[id].ltp[0]).toFixed(2)) {
                ladderLTPHedge = profit;
            }

            const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) <= 0 ? "BACK" : "LAY"

            fullLadderWithProfit[item.odds][side == "BACK" ? 'backProfit' : "layProfit"] = profit
        }

        if (ladderUnmatched === "pl") {
            fullLadderWithProfit[item.odds]['backProfit'] = parseFloat(calcBackProfit(parseFloat(stake), item.odds, 0)) + parseFloat(PL);
        }
    });

    const hedgeSize = selectionMatchedBets !== undefined ?
        selectionMatchedBets.reduce((a, b) => {
            return a + b.size
        }, 0) : 0

    const newStake = selectionMatchedBets !== undefined ? selectionMatchedBets.reduce((a, b) => a + (b.side === "LAY" ? -parseFloat(b.size) : parseFloat(b.size)), 0) + parseFloat(ladderLTPHedge) : 0

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
                sportId={market.eventType.id}
                selectionId={id}
                runner={runners[id]}
                runnerClick={onSelectRunner(runners[id])}
                setLadderDown={setLadderDown}
                PL={PL}
                ladderLTPHedge={ladderLTPHedge}
                newStake={newStake}
                oddsHovered={oddsHovered}
                ordersOnMarket={(Object.keys(unmatchedBets).length + Object.keys(matchedBets).length) > 0}
            />

            <div className={"ladder"} onContextMenu={() => false}>
                <PercentageRow
                    ltp={ladder[id].ltp}
                    tv={
                        ladder[id].tv[0]
                            ? ladder[id].tv[0].toLocaleString()
                            : ""
                    }
                    percent={ladder[id].percent}
                    setLadderSideLeft={setLadderSideLeft}
                    marketId={market.marketId}
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

                            itemData={{
                                ladder: fullLadderWithProfit,
                                selectionId: id,
                                placeOrder: placeOrder,
                                ltp: ladder[id].ltp[0],
                                ltpList: coloredLTPList,
                                stopLoss: stopLoss,
                                changeStopLossList: placeStopLossOrder,
                                hedgeSize: hedgeSize,
                                setOddsHovered: setOddsHovered,
                                volume: parsedVolume,
                                ladderSideLeft: ladderSideLeft
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