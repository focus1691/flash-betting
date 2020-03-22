import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import * as actions from "../../actions/settings";
import * as marketActions from "../../actions/market";
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
import { placeOrder, updateOrders } from "../../actions/order";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import Draggable from "../Draggable";
import { sortGreyHoundMarket } from "../../utils/ladder/SortLadder";
import { UpdateLadder } from "../../utils/ladder/UpdateLadder";
import { stopEntryListChange, stopLossTrailingChange, stopLossCheck } from "../../utils/ExchangeStreaming/MCMHelper";
import { CreateLadder } from "../../utils/ladder/CreateLadder";
import { checkStopLossForMatch, checkTickOffsetForMatch } from "../../utils/ExchangeStreaming/OCMHelper";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";
import ConnectionBugDisplay from "../ConnectionBugDisplay";
import GetSubscriptionErrorType from "../../utils/ErrorMessages/GetSubscriptionErrorType";
import useInterval from "../../utils/CustomHooks/useInterval";

const App = ({ view, isLoading, market, marketStatus, pastEventTime, marketOpen, nonRunners,
  unmatchedBets, matchedBets, stopLossList, tickOffsetList, stopEntryList, socket, setLoading, setPremiumStatus,
  onToggleDefaultView, onToggleActiveView, onToggleSounds, onToggleTools, onToggleUnmatchedBets,
  onToggleMatchedBets, onToggleGraph, onToggleMarketInformation, onUpdateWinMarketsOnly, onToggleRules, onToggleLadderUnmatched,
  onReceiveStakeBtns, onReceiveLayBtns, onReceiveRightClickTicks, onReceiveHorseRaces, onReceiveMarket, onReceiveEventType,
  onMarketClosed, onReceiverLadders, onSortLadder, onSelectRunner, onUpdateRunners,
  onReceiveNonRunners, onMarketStatusChange, setInPlay, setInPlayTime, setMarketPL, onChangeStopLossList,
  onChangeTickOffsetList, onChangeStopEntryList, onChangeLayList, onChangeBackList, onPlaceOrder, onChangeOrders, onChangeFillOrKillList }) => {
  const [marketId, setMarketId] = useState(null);
  const [cookies, removeCookie] = useCookies(["sessionKey", "username", "accessToken", "refreshToken", "expiresIn"]);
  const [updates, setUpdates] = useState([]);
  const [isUpdated, setIsUpdated] = useState(true);
  const [initialClk, setInitialClk] = useState(null);
  const [clk, setClk] = useState(null);
  const [connectionError, setConnectionError] = useState("");

  if (!cookies.sessionKey && !cookies.username) {
    window.location.href = window.location.origin + "/?error=INVALID_SESSION_INFORMATION";
  }

  const loadSession = async () => {
    await fetch(
      `/api/load-session?sessionKey=${encodeURIComponent(cookies.sessionKey)}&email=${encodeURIComponent(
        cookies.username
      )}`
    );
  };

  useInterval(() => {
    if (!isUpdated) {
      onReceiverLadders(updates);
      setIsUpdated(true);
    }
  }, 50);

  const loadSettings = async () => {
    /**
     * Fetch settings from the database and load them into redux state
     * @return {Object} settings
     *   User settings.
     */
    await fetch(`/api/get-user-settings`)
      .then(res => res.json())
      .then(settings => {
        onToggleDefaultView(settings.defaultView);
        onToggleActiveView(settings.defaultView);
        onToggleSounds(settings.sounds);
        onToggleTools(settings.tools);
        onToggleUnmatchedBets(settings.unmatchedBets);
        onToggleMatchedBets(settings.matchedBets);
        onToggleGraph(settings.graphs);
        onToggleMarketInformation(settings.marketInfo);
        onUpdateWinMarketsOnly(settings.winMarketsOnly);
        onToggleRules(settings.rules);
        onToggleLadderUnmatched(settings.ladderUnmatched);
        onReceiveStakeBtns(settings.stakeBtns);
        onReceiveLayBtns(settings.layBtns);
        onReceiveRightClickTicks(settings.rightClickTicks);
        onReceiveHorseRaces(settings.horseRaces);
      })
      .catch(e => {
        window.location.href = window.location.origin + "/?error=USER_SETTINGS_NOT_FOUND";
      });

    /**
     * @return {Boolean} premiumStatus
     *   Premium membership status required to access the LadderView.
     */
    await fetch(`/api/premium-status`)
      .then(res => res.json())
      .then(expiryDate => {
        let now = new Date();
        const isActive = isPremiumActive(now, expiryDate);
        setPremiumStatus(isActive);
      });
  };

  const loadMarket = async () => {
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
              onSortLadder(sortGreyHoundMarket(data.result[0].eventType.id, runners));
              onReceiveEventType(data.result[0].eventType.id);
              onUpdateRunners(runners);
              onReceiveMarket(data.result[0]);
              onSelectRunner(data.result[0].runners[0]);
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

              // Subscribe to Market Change Messages (MCM) via the Exchange Streaming API
              socket.emit("market-subscription", {
                marketId: data.result[0].marketId
              });

              let loadedBackOrders = {};
              let loadedLayOrders = {};
              let loadedStopEntryOrders = {};
              let loadedTickOffsetOrders = {};
              let loadedFillOrKillOrders = {};
              let loadedStopLossOrders = {};
              let loadedUnmatchedOrders = {};
              let loadedMatchedOrders = {};

              await fetch(`/api/get-all-orders`)
                .then(res => res.json())
                .then(async orders => {
                  const loadOrders = async orders => {
                    const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`)
                      .then(res => res.json())
                      .then(res => res.currentOrders);
                    const currentOrdersObject = {};
                    currentOrders.forEach(item => {
                      currentOrdersObject[item.betId] = item;
                      if (item.status === "EXECUTION_COMPLETE") {
                        currentOrdersObject[item.betId].price = item.averagePriceMatched;
                      } else {
                        currentOrdersObject[item.betId].price = item.priceSize.price;
                      }
                    });

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
                            if (currentOrdersObject[order.betId] === "EXECUTABLE") {
                              loadedFillOrKillOrders[order.betId] = order;
                            }
                            break;
                          case "Stop Loss":
                            loadedStopLossOrders[order.selectionId] = order;
                            break;
                          default:
                            break;
                        }
                      }
                    });

                    // handle orders not in the there
                    Object.keys(currentOrdersObject).map(async betId => {
                      const order = currentOrdersObject[betId];

                      const orderData = {
                        strategy: "None",
                        marketId: order.marketId,
                        side: order.side,
                        price: order.price,
                        size: order.status === "EXECUTION_COMPLETE" ? order.sizeMatched : order.priceSize.size,
                        selectionId: order.selectionId,
                        rfs: order.customerStrategyRef ? order.customerStrategyRef : "None",
                        betId: betId
                      };

                      if (order.status === "EXECUTION_COMPLETE") {
                        loadedMatchedOrders[order.betId] = orderData;
                      } else if (order.status === "EXECUTABLE") {
                        loadedUnmatchedOrders[order.betId] = orderData;
                      }
                    });
                  };
                  await loadOrders(orders);
                })
                .then(() => {
                  onChangeOrders({
                    matched: loadedMatchedOrders,
                    unmatched: loadedUnmatchedOrders
                  });
                  onChangeBackList(loadedBackOrders);
                  onChangeLayList(loadedLayOrders);
                  onChangeStopEntryList(loadedStopEntryOrders);
                  onChangeTickOffsetList(loadedTickOffsetOrders);
                  onChangeFillOrKillList(loadedFillOrKillOrders);
                  onChangeStopLossList(loadedStopLossOrders);
                });
            }
          }
        });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadSession();
      await loadSettings();
      await loadMarket();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    socket.on("market-definition", async marketDefinition => {
      // socket.off("market-definition");
      onMarketStatusChange(marketDefinition.status);
      setInPlay(marketDefinition.inPlay);

      if (!market.inPlayTime && marketDefinition.inPlay) {
        // Start the in-play clock
        setInPlayTime(new Date());
      }

      if (marketDefinition.status === "CLOSED" && !marketOpen) {
        onMarketClosed();
        cleanupOnMarketClose(getQueryVariable("marketId"));
      }
    });
  }, [marketStatus, market.inPlayTime, pastEventTime, socket, onMarketStatusChange, setInPlay, marketOpen, setInPlayTime, onMarketClosed]);

  useEffect(() => {
    // A message will be sent here if the connection to the market is disconnected.
    // We resubscribe to the market here using the initialClk & clk.
    socket.on("connection_closed", () => {
      // Subscribe to Market Change Messages (MCM) via the Exchange Streaming API
      if (getQueryVariable("marketId") && initialClk && clk && connectionError === "") {
        socket.emit("market-resubscription", {
          marketId: getQueryVariable("marketId"),
          initialClk: initialClk,
          clk: clk
        });
      }
    });
  }, [clk, initialClk, connectionError, socket]);

  useEffect(() => {
    socket.on("subscription-error", async data => {
      socket.off("subscription-error");
      if (data.statusCode === "FAILURE") {
        if (GetSubscriptionErrorType(data.errorCode) === "Authentication") {
          window.location.href = window.location.origin + `/?error=${data.errorCode}`;
        } else {
          setConnectionError(data.errorMessage);
        }
      } else {
        setConnectionError("");
      }
    });
  }, [connectionError, socket]);

  
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
        onReceiveNonRunners(updatedNonRunners);
      }

      if (mc.rc) {
        let adjustedStopLossList = Object.assign({}, stopLossList);
        let newStopEntryList = Object.assign({}, stopEntryList);
        let stopLossOrdersToRemove = [];

        for (i = 0; i < mc.rc.length; i++) {
          if (mc.rc[i].id in ladders) {
            // Runner found so we update our object with the raw data
            ladders[mc.rc[i].id] = UpdateLadder(ladders[mc.rc[i].id], mc.rc[i]);

            const currentLTP = ladders[mc.rc[i].id].ltp[0];

            // stop Entry
            newStopEntryList = await stopEntryListChange(stopEntryList, mc.rc[i].id, currentLTP, onPlaceOrder, newStopEntryList, unmatchedBets, matchedBets);

            // We increment and check the stoplosses
            if (adjustedStopLossList[mc.rc[i].id]) {
              // if it's trailing and the highest LTP went up, then we add a tickoffset
              const maxLTP = ladders[mc.rc[i].id].ltp.sort((a, b) => b - a)[0];
              let adjustedStopLoss = Object.assign({}, stopLossTrailingChange(stopLossList, mc.rc[i].id, currentLTP, maxLTP));

              // if hedged, get size (price + hedged profit/loss)
              if (adjustedStopLoss.hedged) {
                const newMatchedBets = Object.values(matchedBets).filter(
                  bet => parseFloat(bet.selectionId) === parseFloat(adjustedStopLoss.selectionId)
                );

                adjustedStopLoss.size = CalculateLadderHedge(parseFloat(adjustedStopLoss.price), newMatchedBets, "hedged").size;
              }

              // if it doesn't have a reference or the order has been matched (STOP LOSS)
              const stopLossMatched = stopLossCheck(adjustedStopLoss, mc.rc[i].id, currentLTP, onPlaceOrder,
                adjustedStopLossList, unmatchedBets, matchedBets);

              stopLossOrdersToRemove = stopLossOrdersToRemove.concat(stopLossMatched.stopLossOrdersToRemove);

              adjustedStopLossList = stopLossMatched.adjustedStopLossList;
            }
          } else if (!(mc.rc[i].id in nonRunners)) {
            // Runner found so we create the new object with the raw data
            ladders[mc.rc[i].id] = CreateLadder(mc.rc[i]);
          }
        }

        if (stopLossOrdersToRemove.length > 0) {
          await fetch("/api/remove-orders", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(stopLossOrdersToRemove)
          });
        }

        if (Object.keys(stopLossList).length > 0) {
          onChangeStopLossList(adjustedStopLossList);
        }

        // so it doesn't mess up the loading of the orders
        if (Object.keys(stopEntryList).length > 0) {
          onChangeStopEntryList(newStopEntryList);
        }
        setUpdates(ladders);
        setIsUpdated(false);
      }
    });
  }, [matchedBets, nonRunners, onChangeStopEntryList, onChangeStopLossList, onPlaceOrder, onReceiveNonRunners, stopEntryList, stopLossList, unmatchedBets, updates]);

  /**
   * Listen for Order Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The order change message data:
   */
  const onReceiveOrderMessage = useCallback(async data => {
    const newUnmatchedBets = Object.assign({}, unmatchedBets);
    const newMatchedBets = Object.assign({}, matchedBets);
    let checkForMatchInStopLoss = Object.assign({}, stopLossList);
    let checkForMatchInTickOffset = Object.assign({}, tickOffsetList);
    let tickOffsetOrdersToRemove = [];

    data.oc.forEach(changes => {
      if (!changes.orc) return;
      changes.orc.forEach(runner => {
        if (runner.uo) {
          runner.uo.forEach(order => {
            // If the bet isn't in the unmatchedBets, we should delete it.
            if (order.sr === 0 && order.sm === 0) {
              // this is what happens when an order doesn't get any matched
              delete newUnmatchedBets[order.id];
            } else if (order.sr === 0) {
              // this is what happens when an order is finished
              // if they canceled early
              newMatchedBets[order.id] = Object.assign({}, newUnmatchedBets[order.id], {
                size: parseFloat(order.sm)
              });
              delete newUnmatchedBets[order.id];
            }

            checkForMatchInStopLoss = checkStopLossForMatch(
              stopLossList,
              runner.id,
              order,
              checkForMatchInStopLoss
            );

            // Checks tick offset and then adds to tickOffsetOrdersToRemove if it passes the test, Gets new tickOffsetList without the Order
            const tickOffsetCheck = checkTickOffsetForMatch(
              tickOffsetList,
              order,
              onPlaceOrder,
              tickOffsetOrdersToRemove,
              checkForMatchInTickOffset,
              unmatchedBets,
              matchedBets
            );
            checkForMatchInTickOffset = tickOffsetCheck.checkForMatchInTickOffset;
            tickOffsetOrdersToRemove = tickOffsetCheck.tickOffsetOrdersToRemove;
          });
        }
      });
    });

    if (tickOffsetOrdersToRemove.length > 0) {
      await fetch("/api/remove-orders", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(tickOffsetOrdersToRemove)
      });
    }

    if (Object.keys(stopLossList).length > 0) {
      onChangeStopLossList(checkForMatchInStopLoss);
    }

    if (Object.keys(tickOffsetList).length > 0) {
      onChangeTickOffsetList(checkForMatchInTickOffset);
    }

    if (Object.keys(unmatchedBets).length > 0) {
      onChangeOrders({
        unmatched: newUnmatchedBets,
        matched: newMatchedBets
      });
    }
  }, [matchedBets, onChangeOrders, onChangeStopLossList, onChangeTickOffsetList, onPlaceOrder, stopLossList, tickOffsetList, unmatchedBets]);

  useEffect(() => {
    socket.on("mcm", onReceiveMarketMessage);
    socket.on("ocm", onReceiveOrderMessage);

    return () => {
      socket.off("mcm");
      socket.off("ocm");
    }
  }, [onReceiveMarketMessage, onReceiveOrderMessage, socket]);

  useEffect(() => {
    if (Object.keys(unmatchedBets).length > 0) {
      socket.emit("order-subscription", {
        customerStrategyRefs: JSON.stringify(Object.values(unmatchedBets).map(bet => bet.rfs))
      });
      return () => {
        socket.off("order-subscription");
      };
    }
  }, [unmatchedBets]);

  const cleanupOnMarketClose = marketId => {
    window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
  };

  useInterval(async () => {
    if (marketId) {
      const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(async res => {
        try {
          if (res && res.status === 200) {
            res = await res.json();
            return res.currentOrders || [];
          } else {
            return [];
          }
        } catch (e) {
          return [];
        }
      });
      const currentOrdersObject = {};
      for (var j = 0; j < currentOrders.length; j++) {
        let item = currentOrders[j];
        currentOrdersObject[item.betId] = item;
        if (item.status === "EXECUTION_COMPLETE") {
          currentOrdersObject[item.betId].price = item.averagePriceMatched;
        } else {
          currentOrdersObject[item.betId] = item;
          currentOrdersObject[item.betId].price = item.priceSize.price;
        }
      }

      const loadedUnmatchedOrders = {};
      const loadedMatchedOrders = {};

      Object.keys(currentOrdersObject).map(async betId => {
        const order = currentOrdersObject[betId];

        const orderData = {
          strategy: "None",
          marketId: order.marketId,
          side: order.side,
          price: order.price,
          size: order.status === "EXECUTION_COMPLETE" ? order.sizeMatched : order.priceSize.size,
          selectionId: order.selectionId,
          rfs: order.customerStrategyRef ? order.customerStrategyRef : "None",
          betId: betId
        };

        if (order.status === "EXECUTION_COMPLETE") {
          loadedMatchedOrders[order.betId] = orderData;
        } else if (order.status === "EXECUTABLE") {
          loadedUnmatchedOrders[order.betId] = orderData;
        }
      });

      onChangeOrders({
        matched: loadedMatchedOrders,
        unmatched: loadedUnmatchedOrders
      });
    }
  }, 15000);

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
          <ConnectionBugDisplay
            connectionError={connectionError}
            marketId={marketId}
            clk={clk}
            initialClk={initialClk}
            socket={socket}
            setClk={setClk}
            setInitialClk={setInitialClk}
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
    marketStatus: state.market.status,
    inPlay: state.market.inPlay,
    pastEventTime: state.market.pastEventTime,
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

const mapDispatchToProps = dispatch => {
  return {
    //! Settings
    setLoading: isLoading => dispatch(actions.setIsLoading(isLoading)),
    setPremiumStatus: isPremium => dispatch(actions.setPremiumStatus(isPremium)),
    onToggleDefaultView: view => dispatch(actions.setDefaultView(view)),
    onToggleActiveView: view => dispatch(actions.setActiveView(view)),
    onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
    onToggleTools: settings => dispatch(actions.toggleTools(settings)),
    onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
    onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
    onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
    onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
    onUpdateWinMarketsOnly: isChecked => dispatch(actions.setWinMarketsOnly(isChecked)),
    onToggleRules: settings => dispatch(actions.toggleRules(settings)),
    onToggleLadderUnmatched: unmatchedColumn => dispatch(actions.toggleLadderUnmatched(unmatchedColumn)),
    onReceiveStakeBtns: data => dispatch(actions.setStakeBtns(data)),
    onReceiveLayBtns: data => dispatch(actions.setLayBtns(data)),
    onReceiveRightClickTicks: ticks => dispatch(actions.updateRightClickTicks(ticks)),
    onReceiveHorseRaces: horseRaces => dispatch(actions.setHorseRacingCountries(horseRaces)),
    //! Market
    onReceiveMarket: market => dispatch(marketActions.loadMarket(market)),
    onReceiveEventType: eventType => dispatch(marketActions.setEventType(eventType)),
    onMarketClosed: () => dispatch(marketActions.closeMarket()),
    onReceiverLadders: ladders => dispatch(marketActions.loadLadder(ladders)),
    onSortLadder: sortedLadder => dispatch(marketActions.setSortedLadder(sortedLadder)),
    onSelectRunner: runner => dispatch(marketActions.setRunner(runner)),
    onUpdateRunners: runners => dispatch(marketActions.loadRunners(runners)),
    onReceiveNonRunners: nonRunners => dispatch(marketActions.loadNonRunners(nonRunners)),
    onMarketStatusChange: isOpen => dispatch(marketActions.setMarketStatus(isOpen)),
    setInPlay: inPlay => dispatch(marketActions.setInPlay(inPlay)),
    setInPlayTime: time => dispatch(marketActions.setInPlayTime(time)),
    setMarketPL: pl => dispatch(marketActions.setMarketPL(pl)),
    //! Betting Tools
    onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
    onChangeLayList: list => dispatch(updateLayList(list)),
    onChangeBackList: list => dispatch(updateBackList(list)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onChangeOrders: orders => dispatch(updateOrders(orders)),
    onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);