import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import  { setIsLoading, setPremiumStatus, setDefaultView, setActiveView, toggleSound, toggleTools, toggleUnmatchedBets, 
        toggleMatchedBets, toggleGraph, toggleMarketInformation, setWinMarketsOnly, toggleRules,  toggleLadderUnmatched,
        setStakeBtns, setLayBtns, updateRightClickTicks, setHorseRacingCountries } from "../../actions/settings";
import { loadMarket, setEventType, closeMarket, loadLadder, setSortedLadder, setRunner, loadRunners,
        loadNonRunners, setMarketStatus, setInPlay, setInPlayTime, setMarketPL,
        updateLadderOrder, updateExcludedLadders } from "../../actions/market";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import Spinner from "./Spinner";
import Siderbar from "../Sidebar";
import HomeView from "../HomeView/";
import Views from "../Views";
import SocketContext from "../../SocketContext";
import Title from "./Title";
import getQueryVariable from "../../utils/Market/GetQueryVariable";
import { CreateRunners } from "../../utils/Market/CreateRunners";
import { isPremiumActive } from "../../utils/DateCalculator";
import PremiumPopup from "../PremiumPopup";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { placeOrder, updateOrders, removeOrder, updateOrder } from "../../actions/order";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import Draggable from "../Draggable";
import { sortLadder, sortGreyHoundMarket } from "../../utils/ladder/SortLadder";
import { UpdateLadder } from "../../utils/ladder/UpdateLadder";
import { stopEntryListChange, stopLossCheck } from "../../utils/ExchangeStreaming/MCMHelper";
import { CreateLadder } from "../../utils/ladder/CreateLadder";
import { checkStopLossTrigger, checkTickOffsetTrigger } from "../../utils/ExchangeStreaming/OCMHelper";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";
import compareKeys from "../../utils/Algorithms/CompareKeys";
import ConnectionStatus from "../ConnectionStatus";
import GetSubscriptionErrorType from "../../utils/ErrorMessages/GetSubscriptionErrorType";
import useInterval from "../../utils/CustomHooks/useInterval";

const App = ({ view, isLoading, market, marketOpen, nonRunners,
  unmatchedBets, matchedBets, stopLossList, tickOffsetList, stopEntryList, socket, setIsLoading, setPremiumStatus,
  setDefaultView, setActiveView, toggleSound, toggleTools, toggleUnmatchedBets,
  toggleMatchedBets, toggleGraph, toggleMarketInformation, setWinMarketsOnly, toggleRules, toggleLadderUnmatched,
  setStakeBtns, setLayBtns, updateRightClickTicks, setHorseRacingCountries, loadMarket, setEventType,
  closeMarket, loadLadder, setSortedLadder, updateExcludedLadders, setRunner, loadRunners,
  loadNonRunners, setMarketStatus, setInPlay, setInPlayTime, setMarketPL, updateStopLossList, updateTickOffsetList,
  updateStopEntryList, updateLayList, updateBackList, placeOrder, updateOrders, updateFillOrKillList }) => {
  const [marketId, setMarketId] = useState(null);
  const [cookies, removeCookie] = useCookies(["sessionKey", "username", "accessToken", "refreshToken", "expiresIn"]);
  const [updates, setUpdates] = useState([]);
  const [isUpdated, setIsUpdated] = useState(true);
  const [initialClk, setInitialClk] = useState(null);
  const [clk, setClk] = useState(null);
  const [connectionError, setConnectionError] = useState("");

  const ONE_SECOND = 1000;

  const loadSession = async () => await fetch(`/api/load-session?sessionKey=${encodeURIComponent(cookies.sessionKey)}&email=${encodeURIComponent(cookies.username)}`);
  
  const loadSettings = async () => {
    /**
     * Fetch settings from the database and load them into redux state
     * @return {Object} settings
     *   User settings.
     */
    await fetch(`/api/get-user-settings`)
      .then(res => res.json())
      .then(settings => {
        setDefaultView(settings.defaultView);
        setActiveView(settings.defaultView);
        toggleSound(settings.sounds);
        toggleTools(settings.tools);
        toggleUnmatchedBets(settings.unmatchedBets);
        toggleMatchedBets(settings.matchedBets);
        toggleGraph(settings.graphs);
        toggleMarketInformation(settings.marketInfo);
        setWinMarketsOnly(settings.winMarketsOnly);
        toggleRules(settings.rules);
        toggleLadderUnmatched(settings.ladderUnmatched);
        setStakeBtns(settings.stakeBtns);
        setLayBtns(settings.layBtns);
        updateRightClickTicks(settings.rightClickTicks);
        setHorseRacingCountries(settings.horseRaces);
      }).catch(e => window.location.href = window.location.origin + "/?error=USER_SETTINGS_NOT_FOUND");

    /**
     * @return {Boolean} premiumStatus
     *   Premium membership status required to access the LadderView.
     */
    await fetch(`/api/premium-status`)
      .then(res => res.json())
      .then(expiryDate => setPremiumStatus(isPremiumActive(new Date(), expiryDate)));
  };

  const retrieveBets = async () => {
    if (marketId) {
      try {
        //! Test script
        // console.log("market id: ", marketId);

        // let unm = {};
        // const order = {
        //   strategy: "None",
        //   marketId: "1.170387824",
        //   side: "BACK",
        //   price: 2,
        //   size: 2,
        //   sizeMatched: 1,
        //   sizeRemaining: 1,
        //   selectionId: "28344744",
        //   rfs: 4242424,
        //   betId: 244242
        // }
        // unm[order.betId] = order;

        // if (!compareKeys(unm, unmatchedBets)) {
        //   updateOrders({matched: {}, unmatched: unm});
        // }
        

        let betsChanged = false;
        const betfairBets = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
        const unmatched = {};
        const matched = {};
        for (var i = 0; i < betfairBets.length; i++) {
          const bet = betfairBets[i];
          const order = {
            strategy: "None",
            marketId: bet.marketId,
            side: bet.side,
            price: bet.status === "EXECUTION_COMPLETE" ? bet.averagePriceMatched : bet.priceSize.price,
            size: bet.status === "EXECUTION_COMPLETE" ? bet.sizeMatched : bet.priceSize.size,
            sizeMatched: bet.sizeMatched,
            sizeRemaining: bet.sizeRemaining,
            selectionId: bet.selectionId,
            rfs: bet.customerStrategyRef ? bet.customerStrategyRef : "None",
            betId: bet.betId
          }

          if (bet.status === "EXECUTION_COMPLETE") {
            matched[order.betId] = order;
          }
          else if (bet.status === "EXECUTABLE") {
            unmatched[order.betId] = order;

            if (unmatchedBets[order.betId] !== undefined && (!('sizeRemaining' in unmatchedBets[order.betId]) || unmatchedBets[order.betId].sizeRemaining != order.sizeRemaining) ) {
              betsChanged = true;
            }
          }
        }
        if (betsChanged || !compareKeys(matched, matchedBets) || !compareKeys(unmatched, unmatchedBets)) {
          updateOrders({matched, unmatched});
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onReceiveMarketDefinition = useCallback(async marketDefinition => {
    setMarketStatus(marketDefinition.status);
    setInPlay(marketDefinition.inPlay);

    if (!market.inPlayTime && marketDefinition.inPlay) {
      // Start the in-play clock
      setInPlayTime(new Date());
    }

    if (marketDefinition.status === "CLOSED" && marketOpen) {
      closeMarket();
      window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
    }
  }, [setMarketStatus, setInPlay, market.inPlayTime, marketOpen, setInPlayTime, closeMarket, marketId]);
  
  /**
   * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The market change message data: { rc: [(atb, atl, tv, ltp, id)] }
   */
  const onReceiveMarketMessage = useCallback(data => {
    var i;

    if (data.clk) setClk(data.clk);
    if (data.initialClk) setInitialClk(data.initialClk);

    data.mc.forEach(async mc => {
      var ladders = Object.assign({}, updates);
      var updatedNonRunners = Object.assign({}, nonRunners);

      // Update the market status
      if (mc.marketDefinition) {
        for (i = 0; i < mc.marketDefinition.runners.length; i++) {
          if (mc.marketDefinition.runners[i].status === "REMOVED") {
            if (mc.marketDefinition.runners[i].id in ladders) {
              delete ladders[mc.marketDefinition.runners[i].id];
            }
            if (mc.marketDefinition.runners[i].id in updatedNonRunners === false) {
              updatedNonRunners[mc.marketDefinition.runners[i].id] = ladders[mc.marketDefinition.runners[i].id];
            }
          }
        }
        loadNonRunners(updatedNonRunners);
      }

      if (mc.rc) {
        let newStopEntryList = Object.assign({}, stopEntryList);
        
        for (i = 0; i < mc.rc.length; i++) {
          if (mc.rc[i].id in ladders) {
            // Runner found so we update our object with the raw data
            ladders[mc.rc[i].id] = UpdateLadder(ladders[mc.rc[i].id], mc.rc[i]);

            const currentLTP = ladders[mc.rc[i].id].ltp[0];

            // stop Entry
            newStopEntryList = await stopEntryListChange(stopEntryList, mc.rc[i].id, currentLTP, placeOrder, newStopEntryList, unmatchedBets, matchedBets);

            // Increment and check the stoplosses
            if (stopLossList[mc.rc[i].id] && stopLossList[mc.rc[i].id].assignedIsOrderMatched) {
              let SL = Object.assign({}, stopLossList[mc.rc[i].id]);

              // if it's trailing and the highest LTP went up, then we add a tickoffset
              let maxLTP = ladders[mc.rc[i].id].ltp.sort((a, b) => b - a)[0];

              const stopLossMatched = stopLossCheck(SL, currentLTP);
              if (stopLossMatched.targetMet) {
                const newMatchedBets = Object.values(matchedBets).filter(bet => parseFloat(bet.selectionId) === parseFloat(SL.selectionId));
                placeOrder({
                  marketId: SL.marketId,
                  selectionId: SL.selectionId,
                  side: SL.side,
                  size: CalculateLadderHedge(parseFloat(SL.price), newMatchedBets, "hedged").size,
                  price: stopLossMatched.priceReached,
                  unmatchedBets: unmatchedBets,
                  matchedBets: matchedBets
                });
                
                let newStopLossList = Object.assign({}, stopLossList);
                delete newStopLossList[SL.selectionId];
                updateStopLossList(newStopLossList)

                removeOrder(SL);

              } else if (SL.trailing && currentLTP > maxLTP) {
                SL.tickOffset += 1;
                updateOrder(SL);

                let newStopLossList = Object.assign({}, stopLossList);
                newStopLossList[SL.selectionId] = SL;
                updateStopLossList(newStopLossList)
              }
            }
          } else if (!(mc.rc[i].id in nonRunners) && !(mc.rc[i].id in updatedNonRunners) ) {
            // Runner found so we create the new object with the raw data
            ladders[mc.rc[i].id] = CreateLadder(mc.rc[i]);

            if (i === mc.rc.length -1) {
              var j;
              if (market.eventType === "4339") {
                //! Used to track ladder order when dragging & dropping ladders
                const newOrderList = {};
                for (j = 0; j < market.sortedLadder.length; j++) {
                  newOrderList[j] = market.sortedLadder[j];
                }
                updateLadderOrder(newOrderList);
              } else {
                var sortedLadderIndices = sortLadder(ladders);
                setSortedLadder(sortedLadderIndices);
                updateExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));          
                //! Used to track ladder order when dragging & dropping ladders
                const newOrderList = {};
                for (j = 0; j < sortedLadderIndices.length; j++) {
                  newOrderList[j] = sortedLadderIndices[j];
                }
                updateLadderOrder(newOrderList);
              }
            }
          }
        }
        if (Object.keys(stopEntryList).length > 0) updateStopEntryList(newStopEntryList);

        setUpdates(ladders);
        setIsUpdated(false);
      }
    });
  }, [matchedBets, nonRunners, updateStopEntryList, updateStopLossList, placeOrder, loadNonRunners, stopEntryList, stopLossList, unmatchedBets, updates]);

  const onMarketDisconnect = useCallback(async data => {
    if (GetSubscriptionErrorType(data.errorCode) === "Authentication") window.location.href = window.location.origin + `/?error=${data.errorCode}`;
    else setConnectionError(data.errorMessage.split(':')[0]);
  }, []);

  /**
   * Listen for Order Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The order change message data:
   */
  const onReceiveOrderMessage = useCallback(async data => {
    if (data.oc) {
      const newUnmatchedBets = Object.assign({}, unmatchedBets);
      const newMatchedBets = Object.assign({}, matchedBets);
      for (let i = 0; i < data.oc.length; i++) {
        if (!data.oc[i].orc) continue;

        for (let j = 0; j < data.oc[i].orc.length; j++) {
          if (!data.oc[i].orc[j].uo) continue;

          for (let k = 0; k < data.oc[i].orc[j].uo.length; k++) {
            // If the bet isn't in the unmatchedBets, we should delete it.
            if (data.oc[i].orc[j].uo[k].sr === 0 && data.oc[i].orc[j].uo[k].sm === 0) {
              //! this is what happens when an order doesn't get any matched
              delete newUnmatchedBets[data.oc[i].orc[j].uo[k].id];

              updateOrders({ unmatched: newUnmatchedBets, matched: newMatchedBets });
            } else if (data.oc[i].orc[j].uo[k].sr === 0) {
              // this is what happens when an order is finished
              // if they canceled early
              newMatchedBets[data.oc[i].orc[j].uo[k].id] = Object.assign({}, newUnmatchedBets[data.oc[i].orc[j].uo[k].id], { size: parseFloat(data.oc[i].orc[j].uo[k].sm) });
              delete newUnmatchedBets[data.oc[i].orc[j].uo[k].id];

              updateOrders({ unmatched: newUnmatchedBets, matched: newMatchedBets });
            }

            let isStopLossMatched = checkStopLossTrigger(stopLossList, data.oc[i].orc[j].id, data.oc[i].orc[j].uo[k]);
            if (isStopLossMatched) {
              let newStopLossList = Object.assign({}, stopLossList);
              newStopLossList[data.oc[i].orc[j].id].assignedIsOrderMatched = true;
              updateStopLossList(newStopLossList);
              updateOrder(newStopLossList[data.oc[i].orc[j].id]);
            }

            //* Check TOS matched and place order / remove from database
            let tosTriggered = checkTickOffsetTrigger(tickOffsetList, data.oc[i].orc[j].uo[k]);
            if (tosTriggered) {
              let newTickOffsetList = Object.assign({}, tickOffsetList);
              await removeOrder(newTickOffsetList[data.oc[i].orc[j].uo[k].rfs]);
              await placeOrder({
                marketId: data.oc[i].id,
                selectionId: data.oc[i].orc[j].id,
                side: tickOffsetList[data.oc[i].orc[j].uo[k].rfs].side,
                size: data.oc[i].orc[j].uo[k].s,
                price: data.oc[i].orc[j].uo[k].p,
                unmatchedBets: unmatchedBets,
                matchedBets: matchedBets
              })
              delete newTickOffsetList[data.oc[i].orc[j].uo[k].rfs];
              await updateTickOffsetList(newTickOffsetList);
            }
          }
        }
      }
    }
  }, [unmatchedBets, matchedBets, stopLossList, tickOffsetList, updateOrders, placeOrder, updateStopLossList, updateTickOffsetList]);

  const retrieveMarket = async () => {
    let marketId = getQueryVariable("marketId");

    // Check if the page has query parameter 'marketId'
    // Load the market if found
    if (marketId !== false) {
      await fetch(`/api/get-market-info?marketId=${marketId}`)
        .then(res => res.json())
        .then(async data => {
          if (data.error) {
            removeCookie("sessionKey");
            removeCookie("accessToken");
            removeCookie("refreshToken");
            removeCookie("expiresIn");
            window.location.href = window.location.origin + "/?error=INVALID_SESSION_INFORMATION";
          } else {
            setMarketId(marketId);
            if (data.result.length > 0) {
              const runners = CreateRunners(data.result[0].runners);
              setSortedLadder(sortGreyHoundMarket(data.result[0].eventType.id, runners));
              setEventType(data.result[0].eventType.id);
              loadRunners(runners);
              loadMarket(data.result[0]);
              setRunner(data.result[0].runners[0]);
              const selectionNames = {};

              let runnerIds = Object.keys(runners);

              for (var i = 0; i < runnerIds.length; i++) {
                selectionNames[runnerIds[i]] = runners[runnerIds[i]].runnerName;
              }

              fetch("/api/save-runner-names", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  marketId: marketId,
                  selectionNames: selectionNames
                })
              });

              //* Subscribe to Market Change Messages (MCM) via the Exchange Streaming API
              socket.emit("market-subscription", { marketId: data.result[0].marketId});

              let loadedBackOrders = {};
              let loadedLayOrders = {};
              let loadedStopEntryOrders = {};
              let loadedTickOffsetOrders = {};
              let loadedFillOrKillOrders = {};
              let loadedStopLossOrders = {};

              await fetch(`/api/get-all-orders`)
                .then(res => res.json())
                .then(async orders => {
                  const loadOrders = async orders => {
                    orders.map(async order => {
                      if (order.marketId === marketId) {
                        switch (order.strategy) {
                          case "Back":
                            loadedBackOrders[order.selectionId] =
                              loadedBackOrders[order.selectionId] === undefined
                                ? [order]
                                : loadedBackOrders[order.selectionId].concat(order);
                            break;
                          case "Lay":
                            loadedLayOrders[order.selectionId] =
                              loadedLayOrders[order.selectionId] === undefined
                                ? [order]
                                : loadedLayOrders[order.selectionId].concat(order);
                            break;
                          case "Stop Entry":
                            loadedStopEntryOrders[order.selectionId] =
                              loadedStopEntryOrders[order.selectionId] === undefined
                                ? [order]
                                : loadedStopEntryOrders[order.selectionId].concat(order);
                            break;
                          case "Tick Offset":
                            loadedTickOffsetOrders[order.rfs] = order;
                            break;
                          case "Fill Or Kill":
                            // this should only keep the fill or kill if the order isn't completed already
                              loadedFillOrKillOrders[order.betId] = order;
                            break;
                          case "Stop Loss":
                            loadedStopLossOrders[order.selectionId] = order;
                            break;
                          default:
                            break;
                        }
                      }
                    });
                  };
                  await loadOrders(orders);
                }).then(() => {
                  updateBackList(loadedBackOrders);
                  updateLayList(loadedLayOrders);
                  updateStopEntryList(loadedStopEntryOrders);
                  updateTickOffsetList(loadedTickOffsetOrders);
                  updateFillOrKillList(loadedFillOrKillOrders);
                  updateStopLossList(loadedStopLossOrders);
                });
            }
          }
        });
    }
  };
  
  useInterval(() => {
    if (!isUpdated) {
      loadLadder(updates);
      setIsUpdated(true);
    }
  }, ONE_SECOND);

  useEffect(() => {
    if (!cookies.sessionKey && !cookies.username) {
      window.location.href = window.location.origin + "/?error=INVALID_SESSION_INFORMATION";
    }
  }, [cookies.sessionKey, cookies.username]);

  useEffect(() => {
    const loadData = async () => {
      await loadSession();
      await loadSettings();
      await retrieveMarket();
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    socket.on("mcm", onReceiveMarketMessage);
    socket.on("ocm", onReceiveOrderMessage);
    socket.on("subscription-error", onMarketDisconnect);
    socket.on("market-definition", onReceiveMarketDefinition);

    return () => {
      socket.off("mcm");
      socket.off("ocm");
      socket.off("subscription-error");
      socket.off("market-definition");
    }
  }, [onMarketDisconnect, onReceiveMarketDefinition, onReceiveMarketMessage, onReceiveOrderMessage, socket]);

  useEffect(() => {
    if (Object.keys(unmatchedBets).length > 0) {
      socket.emit("order-subscription", {
        customerStrategyRefs: JSON.stringify(Object.values(unmatchedBets).filter(bet => bet.rfs &&  bet))
      });
      return () => {
        socket.off("order-subscription");
      };
    }
  }, [unmatchedBets]);

  useInterval(async () => retrieveBets(), ONE_SECOND);

  useEffect(() => {
    fetch(`/api/list-market-pl?marketId=${marketId}`)
      .then(res => res.json())
      .then(res => {
        if (res.result !== undefined && res.result[0] !== undefined) {
          const selectionPL = res.result[0].profitAndLosses.reduce((acc, item) => {
            acc[item.selectionId] = item.ifWin;
            return acc;
          }, {});
          setMarketPL(selectionPL);
        }
      });
  }, [marketId, matchedBets, setMarketPL]);

  if (isLoading) return <Spinner />;
  return (
    <div className="horizontal-scroll-wrapper">
      <div className="root">
        <Title />
        <Siderbar />
        <main className="content">
          <ConnectionStatus
            connectionError={connectionError}
            setConnectionError={setConnectionError}
            marketId={marketId}
            clk={clk}
            initialClk={initialClk}
            socket={socket}
          />
          <Draggable />
          {Views[view] || <HomeView />}
          <PremiumPopup />
        </main>
      </div>
    </div>
  );
};

const AppWithSocket = props => (
  <SocketContext.Consumer>{socket => <App {...props} socket={socket} />}</SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    view: state.settings.view,
    isLoading: state.settings.isLoading,
    market: state.market.currentMarket,
    inPlay: state.market.inPlay,
    marketOpen: state.market.marketOpen,
    ladders: state.market.ladder,
    nonRunners: state.market.nonRunners,
    unmatchedBets: state.order.bets.unmatched,
    matchedBets: state.order.bets.matched,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list
  };
};

const mapDispatchToProps = { setIsLoading, setPremiumStatus, setDefaultView, setActiveView, toggleSound, toggleTools,
  toggleUnmatchedBets, toggleMatchedBets, toggleGraph, toggleMarketInformation, setWinMarketsOnly, toggleRules,
  toggleLadderUnmatched, setStakeBtns, setLayBtns, updateRightClickTicks, setHorseRacingCountries, loadMarket, setEventType,
  closeMarket, loadLadder, setSortedLadder, updateLadderOrder, updateExcludedLadders, setRunner, loadRunners, loadNonRunners,
  setMarketStatus, setInPlay, setInPlayTime, setMarketPL, updateStopLossList, updateTickOffsetList, updateStopEntryList,
  updateLayList, updateBackList, placeOrder, updateOrders, updateFillOrKillList };

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);