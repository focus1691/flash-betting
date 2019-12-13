import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import getQueryVariable from "../../utils/Market/GetQueryVariable";
import { UpdateLadder } from '../../utils/ladder/UpdateLadder';
import { checkTimeListAfter } from '../../utils/TradingStategy/BackLay';
import { stopEntryListChange, stopLossTrailingChange, stopLossCheck } from '../../utils/ExchangeStreaming/MCMHelper';
import { calcHedgedPL2 } from '../../utils/TradingStategy/HedingCalculator';
import { CreateLadder } from '../../utils/ladder/CreateLadder';
import { sortLadder } from '../../utils/ladder/SortLadder';
import { checkStopLossForMatch, checkTickOffsetForMatch } from '../../utils/ExchangeStreaming/OCMHelper';
import * as marketActions from "../../actions/market";
import { updateStopLossList } from '../../actions/stopLoss'
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import { updateLayList } from '../../actions/lay';
import { updateBackList } from '../../actions/back';
import { placeOrder, updateOrders } from '../../actions/order';

const MarketReceiver = props => {
    const cleanupOnMarketClose = (marketId) => {
        window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
    }

    useEffect(() => {
        props.socket.on("market-definition", async marketDefinition => {
            props.onMarketStatusChange(marketDefinition.status);
            props.setInPlay(marketDefinition.inPlay);

            if (marketDefinition.status === "CLOSED" && !props.marketOpen) {
                props.socket.off("market-definition");
                props.onMarketClosed();
                cleanupOnMarketClose(getQueryVariable("marketId"));
            }
        });
    }, [props.marketStatus]);

    useEffect(() => {
        // A message will be sent here if the connection to the market is disconnected.
        // We resubscribe to the market here using the initialClk & clk.
        props.socket.on("connection_closed", () => {
            console.log("Connection to the market (MCM) was lost. We need to resubscribe here.\nUse the clk/initialClk");
        });
    }, []);

    useEffect(() => {
        /**
         * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
         * @param {obj} data The market change message data: { rc: [(atb, atl, batb, batl, tv, ltp, id)] }
         */
        props.socket.on("mcm", data => {
            // Turn the socket off to prevent the listener from runner more than once. It will back on once the component reset.
            props.socket.off("mcm");
            const marketId = getQueryVariable("marketId");

            // initialClk = Initial clock. Sent once at the start.
            // clk = Clock. Sent on every new update sent.
            // These values are used as parameters to resubscribe to the market in the event of a disconnect.
            if (data.initialClk) {
                props.onReceiveInitialClk(data.initialClk);
            }
            if (data.clk) {
                props.onReceiveClk(data.clk);
            }

            data.mc.forEach(async mc => {
                let eventTypeId = props.eventType;
                let marketStatus = props.marketStatus;

                var ladders = Object.assign({}, props.ladders);
                var nonRunners = Object.assign({}, props.nonRunners);

                // Update the market status
                if (mc.marketDefinition) {
                    marketStatus = mc.marketDefinition.status;
                    eventTypeId = mc.marketDefinition.eventTypeId;

                    props.onMarketStatusChange(marketStatus);
                    props.setInPlay(mc.marketDefinition.inPlay);

                    if (!props.market.inPlayTime && mc.marketDefinition.inPlay) {
                        // Start the in-play clock
                        props.setInPlayTime(new Date());
                    }

                    mc.marketDefinition.runners.forEach(runner => {
                        if (runner.status === "REMOVED") {
                            if (runner.id in ladders) {
                                delete ladders[runner.id];
                            }
                            if (runner.id in nonRunners === false) {
                                nonRunners[runner.id] = ladders[runner.id];
                            }
                        }
                    });
                    props.onReceiveNonRunners(nonRunners);
                }

                if (mc.rc) {
                    let adjustedStopLossList = Object.assign({}, props.stopLossList);
                    const adjustedBackList = {};
                    const adjustedLayList = {};
                    let newStopEntryList = Object.assign({}, props.stopEntryList);

                    let stopLossOrdersToRemove = [];

                    await Promise.all(mc.rc.map(async rc => {

                        if (rc.id in props.ladders) {
                            // Runner found so we update our object with the raw data
                            ladders[rc.id] = UpdateLadder(props.ladders[rc.id], rc);

                            // Back and Lay
                            if (props.marketDefinition && props.marketDefinition.marketStatus === "RUNNING") {
                                const adjustedBackOrderArray = await checkTimeListAfter(props.backList[rc.id], rc.id, mc.marketDefinition.openDate, props.onPlaceOrder, marketId, "BACK", props.matchedBets, props.unmatchedBets)
                                if (adjustedBackOrderArray.length > 0) {
                                    adjustedBackList[rc.id] = adjustedBackOrderArray;
                                }

                                const adjustedLayOrderArray = await checkTimeListAfter(props.layList[rc.id], rc.id, mc.marketDefinition.openDate, props.onPlaceOrder, marketId, "LAY", props.matchedBets, props.unmatchedBets)
                                if (adjustedLayOrderArray.length > 0) {
                                    adjustedLayList[rc.id] = adjustedLayOrderArray;
                                }
                            }

                            // stop Entry

                            newStopEntryList = stopEntryListChange(props.stopEntryList, rc.id, rc.ltp, props.onPlaceOrder, newStopEntryList, props.unmatchedBets, props.matchedBets);
                            // We increment and check the stoplosses
                            if (props.stopLossList[rc.id] !== undefined) {
                                // if it's trailing and the highest LTP went up, then we add a tickoffset
                                const maxLTP = props.ladders[rc.id].ltp.sort((a, b) => b - a)[0];
                                let adjustedStopLoss = Object.assign({}, stopLossTrailingChange(props.stopLossList, rc.id, rc.ltp, maxLTP));

                                // if hedged, get size (price + hedged profit/loss)
                                if (adjustedStopLoss.hedged) {
                                    const newMatchedBets = Object.values(props.bets.matched).filter(bet => bet.selectionId == adjustedStopLoss.selectionId);

                                    const combinedSize =
                                        newMatchedBets.reduce((a, b) => {
                                            return a + b.size;
                                        }, 0);

                                    const profitArray = newMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(adjustedStopLoss.price)));
                                    const profit = (-1 * profitArray.reduce((a, b) => a + b, 0));
                                    adjustedStopLoss.size = combinedSize + profit;
                                }

                                // if it doesn't have a reference or the order has been matched (STOP LOSS)
                                const stopLossMatched = stopLossCheck(adjustedStopLoss, rc.id, rc.ltp, props.onPlaceOrder, stopLossOrdersToRemove, adjustedStopLossList, props.unmatchedBets, props.matchedBets);
                                adjustedStopLossList = stopLossMatched.adjustedStopLossList;
                                stopLossOrdersToRemove = stopLossMatched.stopLossOrdersToRemove;
                            }

                        }
                        else if (rc.id in nonRunners === false) {
                            // Runner found so we create the new object with the raw data
                            ladders[rc.id] = CreateLadder(rc);
                        }
                    }));

                    if (stopLossOrdersToRemove.length > 0) {
                        await fetch('/api/remove-orders', {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify(stopLossOrdersToRemove)
                        })
                    }

                    // so it doesn't mess up the loading of the orders
                    if (Object.keys(props.backList).length > 0) {
                        props.onChangeBackList(adjustedBackList);
                    }
                    if (Object.keys(props.layList).length > 0) {
                        props.onChangeLayList(adjustedLayList);
                    }
                    if (Object.keys(props.stopEntryList).length > 0) {
                        props.onChangeStopEntryList(newStopEntryList);
                    }
                    if (Object.keys(props.stopLossList).length > 0) {
                        props.onChangeStopLossList(adjustedStopLossList);
                    }

                    // If it's not a Greyhound Race (4339), we sort by the LTP
                    if (eventTypeId !== "4339") {
                        var sortedLadderIndices = sortLadder(ladders);
                        props.onSortLadder(sortedLadderIndices);
                        props.onChangeExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
                    }
                    props.onReceiverLadders(ladders);
                }
            });
        });

        /**
         * Listen for Order Change Messages from the Exchange Streaming socket and create/update them
         * @param {obj} data The order change message data:
         */
        props.socket.on("ocm", async data => {
            const newUnmatchedBets = Object.assign({}, props.unmatchedBets);
            const newMatchedBets = Object.assign({}, props.matchedBets);
            let checkForMatchInStopLoss = Object.assign({}, props.stopLossList);
            let checkForMatchInTickOffset = Object.assign({}, props.tickOffsetList);
            let tickOffsetOrdersToRemove = [];

            data.oc.forEach(changes => {
                changes.orc.forEach(runner => {
                    if (runner.uo) {
                        runner.uo.forEach(order => {
                            // If the bet isn't in the unmatchedBets, we should delete it.
                            if (newUnmatchedBets[order.id] !== undefined) {
                                delete newUnmatchedBets[order.id];
                            } else if (order.sr == 0) { // this is what happens when an order is finished
                                newMatchedBets[order.id] = newUnmatchedBets[order.id];
                                delete newUnmatchedBets[order.id];
                            }

                            checkForMatchInStopLoss = checkStopLossForMatch(props.stopLossList, runner.id, order, checkForMatchInStopLoss);

                            // Checks tick offset and then adds to tickOffsetOrdersToRemove if it passes the test, Gets new tickOffsetList without the Order
                            const tickOffsetCheck = checkTickOffsetForMatch(props.tickOffsetList, order, props.onPlaceOrder, tickOffsetOrdersToRemove, checkForMatchInTickOffset, props.unmatchedBets, props.matchedBets);
                            checkForMatchInTickOffset = tickOffsetCheck.checkForMatchInTickOffset;
                            tickOffsetOrdersToRemove = tickOffsetCheck.tickOffsetOrdersToRemove;
                        });
                    }
                });
            });


            if (tickOffsetOrdersToRemove.length > 0) {
                await fetch('/api/remove-orders', {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(tickOffsetOrdersToRemove)
                })
            }

            if (Object.keys(props.stopLossList).length > 0) {
                props.onChangeStopLossList(checkForMatchInStopLoss);
            }

            if (Object.keys(props.tickOffsetList).length > 0) {
                props.onChangeTickOffsetList(checkForMatchInTickOffset);
            }

            if (Object.keys(props.unmatchedBets).length > 0) {
                props.onChangeOrders({
                    unmatched: newUnmatchedBets,
                    matched: newMatchedBets,
                });
            }
            props.socket.off("ocm");
        });
    }, [props.ladders, props.marketStatus]);

    return null;
}

const mapStateToProps = state => {
    return {
        market: state.market.currentMarket,
        eventType: state.market.eventType,
        marketOpen: state.market.marketOpen,
        marketStatus: state.market.status,
        ladders: state.market.ladder,
        sortedLadded: state.market.sortedLadder,
        nonRunners: state.market.nonRunners,
        stopLossList: state.stopLoss.list,
        tickOffsetList: state.tickOffset.list,
        stopEntryList: state.stopEntry.list,
        fillOrKillList: state.fillOrKill.list,
        layList: state.lay.list,
        backList: state.back.list,
        unmatchedBets: state.order.bets.unmatched,
        matchedBets: state.order.bets.matched
    };
};

const mapDispatchToProps = dispatch => {
    return {
        /** Market **/
        onMarketClosed: () => dispatch(marketActions.closeMarket()),
        onReceiveInitialClk: initialClk => dispatch(marketActions.setInitialClk(initialClk)),
        onReceiveClk: clk => dispatch(marketActions.setClk(clk)),
        onReceiverLadders: ladders => dispatch(marketActions.loadLadder(ladders)),
        onSortLadder: sortedLadder => dispatch(marketActions.setSortedLadder(sortedLadder)),
        onReceiveNonRunners: nonRunners => dispatch(marketActions.loadNonRunners(nonRunners)),
        onChangeExcludedLadders: excludedLadders => dispatch(marketActions.updateExcludedLadders(excludedLadders)),
        onMarketStatusChange: isOpen => dispatch(marketActions.setMarketStatus(isOpen)),
        setInPlay: inPlay => dispatch(marketActions.setInPlay(inPlay)),
        setInPlayTime: time => dispatch(marketActions.setInPlayTime(time)),
        /** Betting Tools **/
        onChangeStopLossList: list => dispatch(updateStopLossList(list)),
        onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
        onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
        onChangeLayList: list => dispatch(updateLayList(list)),
        onChangeBackList: list => dispatch(updateBackList(list)),
        onPlaceOrder: order => dispatch(placeOrder(order)),
        onChangeOrders: orders => dispatch(updateOrders(orders))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketReceiver);