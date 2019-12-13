import React, { useState, useRef, useEffect, memo } from "react";
import { connect } from "react-redux";
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
import { placeOrder, cancelOrder } from "../../actions/order";
import { updateLadderOrder } from "../../actions/market";
import { updateStopLossList } from "../../actions/stopLoss";
import { getUnmatchedBets, getMatchedBets } from "../../selectors/orderSelector";
import { getLadder, getLTP } from "../../selectors/marketSelector";
import { getStakeVal } from "../../selectors/settingsSelector";

const Ladder = ({ id, ltp, marketStatus, onPlaceOrder, onCancelOrder, order, ladderSideLeft, setLadderSideLeft, onChangeStopLossList, unmatchedBets, matchedBets, ladderUnmatched, stake, stopLossOffset, stopLossTrailing, stopLossList }) => {
    const containerRef = useRef(null);
    const listRef = useRef();
    const [listRefSet, setlistRefSet] = useState(false);

    const [isReferenceSet, setIsReferenceSet] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isLadderDown, setLadderDown] = useState(false);

    // every 1 second, checks if there is an LTP, if there is, we scroll to it and stop the interval
    useEffect(() => {
        const interval = setInterval(() => {
            const ltpIndex = ALL_PRICES.findIndex(item => parseFloat(item) === parseFloat(ltp[0]));
            if (listRef.current !== null && ltpIndex !== -1) {
                // we do the calculation because we start in reverse
                listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, 'center');
                clearInterval(interval);
                setlistRefSet(true);
            }
        }, 1000)

    }, [listRef]);

    // if the order changes, we scrollback to the ltp 
    useEffect(() => {
        const ltpIndex = ALL_PRICES.findIndex(item => parseFloat(item) === parseFloat(ltp[0]));
        if (listRef.current !== undefined) {
            // we do the calculation because we start in reverse
            listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, 'center');
        }
    }, [order]);

    const placeOrder = data => {
        onPlaceOrder({
            marketId: data.marketId,
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

    const placeStopLossOrder = async data => {
        const newStopLoss = {
            marketId: data.marketId,
            selectionId: parseInt(id),
            side: data.side,
            size: data.size,
            price: data.price,
            units: data.units,
            rfs: data.rfs,
            assignedIsOrderMatched: data.assignedIsOrderMatched,
            betId: data.betId,
            hedged: data.hedged,
            strategy: "Stop Loss",
            tickOffset: data.custom ? 0 : stopLossOffset,
            trailing: data.custom ? false : stopLossTrailing
        };

        const newStopLossList = Object.assign({}, stopLossList) 
        newStopLossList[newStopLoss.selectionId] = newStopLoss

        await fetch('/api/save-order', {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(newStopLoss)
        })

        onChangeStopLossList(newStopLossList);
    }

    const handleHedgeCellClick = (clickSide, unmatchedBetOnRow, marketId, hedgeSize, leftSide, rightSide, price, selectionId) => e => {
        const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
  
        // CANCEL ORDER IF CLICK UNMATCHED BET
        if (unmatchedBetOnRow) {
          cancelOrder({
            marketId: marketId,
            betId: unmatchedBetOnRow.betId,
            sizeReduction: null,
            matchedBets: matchedBets,
            unmatchedBets: unmatchedBets
          })
        }
        else if (!unmatchedBetOnRow && hedgeSize > 0) {
          placeOrder({
            side: clickSide === 0 ? leftSide : rightSide,
            price: formatPrice(price),
            selectionId: selectionId,
            customerStrategyRef: referenceStrategyId,
            // size: hedgeSize + parseFloat(ladder[key][clickSide === 0 ? leftSideProfit : rightSideProfit])
          });
        }
      };


    // const PL = matchedBets !== undefined ? getPLForRunner(market.marketId, parseInt(id), { matched: matchedBets }).toFixed(2) : 0;

    // const { ladderLTPHedge, fullLadderWithProfit } = CalculateLadderHedge(ladder, id, selectionMatchedBets, ladderUnmatched, stake, PL);

    // gets all the bets we made and creates a size to offset
    // const hedgeSize = selectionMatchedBets !== undefined ?
    //     selectionMatchedBets.reduce((a, b) => {
    //         return a + b.size;
    //     }, 0) : 0;

    // const newStake = selectionMatchedBets !== undefined ? selectionMatchedBets.reduce((a, b) => a + (b.side === "LAY" ? -parseFloat(b.size) : parseFloat(b.size)), 0) + parseFloat(ladderLTPHedge) : 0;
    
    return (
        <LadderContainer
            isReferenceSet={isReferenceSet}
            order={order}
            containerRef={containerRef}
            isMoving={isMoving}
            isLadderDown={isLadderDown}
            setIsReferenceSet={setIsReferenceSet}
            setIsMoving={setIsMoving}
            setLadderDown={setLadderDown}
            marketStatus = {marketStatus}
        >
            <LadderHeader
                selectionId={id}
                setLadderDown={setLadderDown}
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
                            itemCount={ALL_PRICES.length}
                            itemSize={20}
                            width={width}
                            ref={listRef}
                            style={{ paddingRight: `${listRefSet ? listRef.current.offsetWidth - listRef.current.clientWidth : -17}px` }}

                            itemData = {{
                                selectionId: id,
                                placeOrder: placeOrder,
                                cancelOrder: onCancelOrder,
                                changeStopLossList: placeStopLossOrder,
                                ladderSideLeft: ladderSideLeft,
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

const mapStateToProps = (state, {id}) => {
    return {
      // market: state.market.currentMarket,
      ltp: getLTP(state.market.ladder, {selectionId: id}), 
      unmatchedBets: getUnmatchedBets(state.order.bets),
      matchedBets: getMatchedBets(state.order.bets),
      stopLossList: state.stopLoss.list,
      stopLossSelected: state.stopLoss.selected,
      stopLossOffset: state.stopLoss.offset,
      ladderUnmatched: state.settings.ladderUnmatched,
      stakeVal: getStakeVal(state.settings.stake, {selectionId: id}),
      ladderSideLeft: state.market.ladderSideLeft
    };  
};

const mapDispatchToProps = dispatch => {
    return {
      onPlaceOrder: order => dispatch(placeOrder(order)),
      onCancelOrder: order => dispatch(cancelOrder(order)),
      onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    };
};

function areEqualShallow(a, b) {
    const diff = [];
    for(var key in a) {
        if(!(key in b) || a[key] !== b[key]) {
            diff.push(key)
        }
    }
    
    return diff;
}

const arePropsEqual = (prevProps, nextProps) => {
    // if only ltp changed
    if (areEqualShallow(prevProps, nextProps).length === 1) {
        if (nextProps[0] === 'ltp' && prevProps.ltp === undefined) {
            return false;
        } else if (nextProps[0] === 'ltp') {
            return true;
        }
    }

    return false
}


export default connect(mapStateToProps, mapDispatchToProps)(memo(Ladder, arePropsEqual));