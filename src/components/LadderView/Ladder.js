import React, { memo, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import crypto from 'crypto';
import { cancelOrder, placeOrder } from "../../actions/order";
import { updateStopLossList } from "../../actions/stopLoss";
import { getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getUnmatchedBets, getSelectionMatchedBets } from "../../selectors/orderSelector";
import { getStakeVal } from "../../selectors/settingsSelector";
import { ALL_PRICES, formatPrice } from "../../utils/ladder/CreateFullLadder";
import LadderContainer from './LadderContainer';
import LadderHeader from "./LadderHeader";
import LadderRow from "./LadderRow";
import OrderRow from "./OrderRow";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";

const Ladder = ({ id, ltp, marketStatus, onPlaceOrder, onCancelOrder, order, ladderSideLeft, setLadderSideLeft, onChangeStopLossList, unmatchedBets, matchedBets, stopLossOffset, stopLossTrailing, stopLossList }) => {
    const containerRef = useRef(null);
    const listRef = useRef();
    const [listRefSet, setlistRefSet] = useState(false);
    const [isReferenceSet, setIsReferenceSet] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [isLadderDown, setLadderDown] = useState(false);
    
    const scrollToLTP = () => {
        const ltpIndex = ALL_PRICES.findIndex(item => parseFloat(item) === parseFloat(ltp[0]));
        if (listRef.current !== null && listRef.current !== undefined && ltpIndex !== -1) {
            // we do the calculation because we start in reverse
            listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, 'center');
            setlistRefSet(true);
        }
    };

    // Scroll to the LTP when the ladder first loads
    useEffect(() => {
        setTimeout(() => {
            scrollToLTP();
        }, 1000);
    }, []);

    // Scroll to LTP when the LTP or order changes
    useEffect(() => {
        scrollToLTP();
    }, [ltp, order]);

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

    const handleHedgeCellClick = (marketId, selectionId, unmatchedBetOnRow, side, price, size) => {
        const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);

        // CANCEL ORDER IF CLICK UNMATCHED BET
        if (unmatchedBetOnRow) {
          onCancelOrder({
            marketId: marketId,
            betId: unmatchedBetOnRow.betId,
            sizeReduction: null,
            matchedBets: matchedBets,
            unmatchedBets: unmatchedBets
          })
        }
        else if (!unmatchedBetOnRow && size > 0) {
          placeOrder({
            marketId: marketId,
            side: side,
            price: formatPrice(price),
            selectionId: selectionId,
            customerStrategyRef: referenceStrategyId,
            size: size
          });
        }
    };

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
                                handleHedgeCellClick: handleHedgeCellClick,
                                isMoving: isMoving
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
      ltp: getLTP(state.market.ladder, {selectionId: id}), 
      unmatchedBets: getUnmatchedBets(state.order.bets),
      matchedBets: getMatchedBets(state.order.bets),
      selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {selectionId: id}),
      stopLossList: state.stopLoss.list,
      stopLossOffset: state.stopLoss.offset,
      ladderUnmatched: state.settings.ladderUnmatched,
      stakeVal: getStakeVal(state.settings.stake, {selectionId: id}),
      ladderSideLeft: state.market.ladderSideLeft,
      draggingLadder: state.market.draggingLadder
    };  
};

const mapDispatchToProps = dispatch => {
    return {
      onPlaceOrder: order => dispatch(placeOrder(order)),
      onCancelOrder: order => dispatch(cancelOrder(order)),
      onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    };
};

const isMoving = (prevProps, nextProps) => {
    if (nextProps.draggingLadder === nextProps.id && prevProps.order === nextProps.order) {
        return true;
    } else {
        return false;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Ladder, isMoving));