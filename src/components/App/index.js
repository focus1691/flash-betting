import React, { useState, useEffect, useRef } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import * as actions from "../../actions/settings";
import * as marketActions from "../../actions/market";
import { updateStopLossList } from '../../actions/stopLoss'
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import Spinner from "./Spinner";
import Siderbar from "../Sidebar";
import HomeView from "../HomeView/";
import LadderView from "../LadderView/";
import GridView from "../GridView/";
import SocketContext from "../../SocketContext";
import Title from "./Title";
import getQueryVariable from "../../utils/Market/GetQueryVariable";
import { CreateRunners } from "../../utils/Market/CreateRunners";
import { isPremiumActive } from "../../utils/DateCalculator";
import PremiumPopup from "../PremiumPopup";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { placeOrder, updateOrders } from '../../actions/order';
import { updateFillOrKillList } from "../../actions/fillOrKill";
import Draggable from "../Draggable";
import { sortGreyHoundMarket } from "../../utils/ladder/SortLadder";
import { UpdateLadder } from '../../utils/ladder/UpdateLadder';
import { checkTimeListsAfter } from '../../utils/TradingStategy/BackLay';
import { stopEntryListChange, stopLossTrailingChange, stopLossCheck } from '../../utils/ExchangeStreaming/MCMHelper';
import { CreateLadder } from '../../utils/ladder/CreateLadder';
import { sortLadder } from '../../utils/ladder/SortLadder';
import { checkStopLossForMatch, checkTickOffsetForMatch } from '../../utils/ExchangeStreaming/OCMHelper';
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";
import ConnectionBugDisplay from "../ConnectionBugDisplay";
import GetSubscriptionErrorType from "../../utils/ErrorMessages/GetSubscriptionErrorType";

const App = props => {
  const [marketId, setMarketId] = useState(null);
  const [cookies, removeCookie] = useCookies(['sessionKey', 'username', 'accessToken', 'refreshToken', 'expiresIn']);
  const [updates, setUpdates] = useState([]);
  const [isUpdated, setIsUpdated] = useState(true);
  const [initialClk, setInitialClk] = useState(null);
  const [clk, setClk] = useState(null);
  const [connectionError, setConnectionError] = useState("")

  if (!cookies.sessionKey && !cookies.username) {
    window.location.href = window.location.origin + "/?error=INVALID_SESSION_INFORMATION";
  }
  const loadSession = async () => {
    await fetch(
      `/api/load-session?sessionKey=${encodeURIComponent(
        cookies.sessionKey
      )}&email=${encodeURIComponent(cookies.username)}`
    );
  };

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(() => {
    if (!isUpdated) {
      props.onReceiverLadders(updates);
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
        props.onToggleDefaultView(settings.defaultView);
        props.onToggleActiveView(settings.defaultView);
        props.onToggleSounds(settings.sounds);
        props.onToggleTools(settings.tools);
        props.onToggleUnmatchedBets(settings.unmatchedBets);
        props.onToggleMatchedBets(settings.matchedBets);
        props.onToggleGraph(settings.graphs);
        props.onToggleMarketInformation(settings.marketInfo);
        props.onUpdateWinMarketsOnly(settings.winMarketsOnly);
        props.onToggleRules(settings.rules);
        props.onToggleLadderUnmatched(settings.ladderUnmatched);
        props.onReceiveStakeBtns(settings.stakeBtns);
        props.onReceiveLayBtns(settings.layBtns);
        props.onReceiveRightClickTicks(settings.rightClickTicks);
        props.onReceiveHorseRaces(settings.horseRaces);
      })
      .catch(e => {
        window.location.href = window.location.origin + "/?error=USER_SETTINGS_NOT_FOUND";
      })

    /**
     * @return {Boolean} premiumStatus
     *   Premium membership status required to access the LadderView.
     */
    await fetch(`/api/premium-status`)
      .then(res => res.json())
      .then(expiryDate => {
        let now = new Date();
        const isActive = isPremiumActive(now, expiryDate);
        props.setPremiumStatus(isActive);
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
            removeCookie('sessionKey');
            removeCookie('accessToken');
            removeCookie('refreshToken');
            removeCookie('expiresIn');
            window.location.href = window.location.origin + "/?error=INVALID_SESSION_INFORMATION";
          } else {
            setMarketId(marketId);
            if (data.result.length > 0) {
              const runners = CreateRunners(data.result[0].runners);
              props.onSortLadder(sortGreyHoundMarket(data.result[0].eventType.id, runners));
              props.onReceiveEventType(data.result[0].eventType.id);
              props.onUpdateRunners(runners);
              props.onReceiveMarket(data.result[0]);
              props.onSelectRunner(data.result[0].runners[0]);
              const selectionNames = {};

              Object.keys(runners).forEach(selectionId => {
                selectionNames[selectionId] = runners[selectionId].runnerName;
              });

              fetch('/api/save-runner-names', {
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
              props.socket.emit("market-subscription", {
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
                    const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
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
                            loadedBackOrders[order.selectionId] = loadedBackOrders[order.selectionId] === undefined ? [order] : loadedBackOrders[order.selectionId].concat(order);
                            break;
                          case "Lay":
                            loadedLayOrders[order.selectionId] = loadedLayOrders[order.selectionId] === undefined ? [order] : loadedLayOrders[order.selectionId].concat(order);
                            break;
                          case "Stop Entry":
                            loadedStopEntryOrders[order.selectionId] = loadedStopEntryOrders[order.selectionId] === undefined ? [order] : loadedStopEntryOrders[order.selectionId].concat(order);
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
                      }

                      if (order.status === "EXECUTION_COMPLETE") {
                        loadedMatchedOrders[order.betId] = orderData;
                      } else if (order.status === "EXECUTABLE") {
                        loadedUnmatchedOrders[order.betId] = orderData;
                      }
                    });
                  }
                  await loadOrders(orders);
                }).then(() => {
                  props.onChangeOrders({
                    matched: loadedMatchedOrders,
                    unmatched: loadedUnmatchedOrders
                  });
                  props.onChangeBackList(loadedBackOrders);
                  props.onChangeLayList(loadedLayOrders);
                  props.onChangeStopEntryList(loadedStopEntryOrders);
                  props.onChangeTickOffsetList(loadedTickOffsetOrders);
                  props.onChangeFillOrKillList(loadedFillOrKillOrders);
                  props.onChangeStopLossList(loadedStopLossOrders);
                });
            }
          }
        });
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await loadSession();
      await loadSettings();
      await loadMarket();
      props.setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    props.socket.on("market-definition", async marketDefinition => {
      // props.socket.off("market-definition");
        props.onMarketStatusChange(marketDefinition.status);
        props.setInPlay(marketDefinition.inPlay);

        if (!props.market.inPlayTime && marketDefinition.inPlay) {
          // Start the in-play clock
          props.setInPlayTime(new Date());
        }

        if (marketDefinition.status === "CLOSED" && !props.marketOpen) {
            props.onMarketClosed();
            cleanupOnMarketClose(getQueryVariable("marketId"));
        }
    });
}, [props.marketStatus, props.market.inPlayTime, props.pastEventTime]);

  useEffect(() => {
    let eventTypeId = props.eventType;

      // If it's not a Greyhound Race (4339), we sort by the LTP
      if (eventTypeId !== "4339") {
        let ladders = Object.assign({}, props.ladders);
        var sortedLadderIndices = sortLadder(ladders);
        props.onSortLadder(sortedLadderIndices);
        props.onChangeExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
    }

  }, [Object.values(props.ladders).length]);

  useEffect(() => {
    // A message will be sent here if the connection to the market is disconnected.
    // We resubscribe to the market here using the initialClk & clk.
    props.socket.on("connection_closed", () => {
      // Subscribe to Market Change Messages (MCM) via the Exchange Streaming API
      if (getQueryVariable("marketId") && initialClk && clk && connectionError === "") {
        props.socket.emit("market-resubscription", {
          marketId: getQueryVariable("marketId"),
          initialClk: initialClk,
          clk: clk
        });
      }
    });
  }, [clk, initialClk, connectionError]);


  useEffect(() => {
    props.socket.on("subscription-error", async data => {
      props.socket.off("subscription-error");
        if (data.statusCode === "FAILURE") {
            if (GetSubscriptionErrorType(data.errorCode) === "Authentication") {
                window.location.href = window.location.origin + `/?error=${data.errorCode}`;
            } else {
                setConnectionError(data.errorMessage)
            }
        } else {
            setConnectionError("")
        }
    })
  }, [connectionError]);

  useEffect(() => {
    // Back and Lay
    const updateBackList = async (list, startTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets) => {
      let newBackList = await checkTimeListsAfter(list, startTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets);
      if (Object.keys(props.backList).length > 0) {
        props.onUpdateBackList(newBackList);
      }
    }

    const updateLayList = async (list, startTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets) => {
      let newLayList = await checkTimeListsAfter(list, startTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets);
      if (Object.keys(props.layList).length > 0) {
        props.onUpdateLayList(newLayList);
      }
    }

    if (props.market && props.market.marketStartTime && new Date().valueOf() > new Date(props.market.marketStartTime).valueOf()) {
      updateBackList(props.backList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "BACK", props.matchedBets, props.unmatchedBets);
      updateLayList(props.layList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "LAY", props.matchedBets, props.unmatchedBets);
    }
  }, [props.ladders]);

  useEffect(() => {
      /**
       * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
       * @param {obj} data The market change message data: { rc: [(atb, atl, tv, ltp, id)] }
       */
      props.socket.on("mcm", data => {
          // Turn the socket off to prevent the listener from runner more than once. It will back on once the component reset.
          props.socket.off("mcm");
          
          if (data.clk) {
            setClk(data.clk);
          }

          if (data.initialClk) {
            setInitialClk(data.initialClk);
            props.onReceiveInitialClk(data.initialClk);
          }

          data.mc.forEach(async mc => {
              var ladders = Object.assign({}, updates);
              var nonRunners = Object.assign({}, props.nonRunners);

              // Update the market status
              if (mc.marketDefinition) {
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
                  let newStopEntryList = Object.assign({}, props.stopEntryList);

                  let stopLossOrdersToRemove = [];

                  await Promise.all(mc.rc.map(async rc => {

                      if (rc.id in ladders) {
                          // Runner found so we update our object with the raw data
                          ladders[rc.id] = UpdateLadder(ladders[rc.id], rc);

                          const currentLTP = ladders[rc.id].ltp[0]

                          // stop Entry
                          newStopEntryList = await stopEntryListChange(props.stopEntryList, rc.id, currentLTP, props.onPlaceOrder, newStopEntryList, props.unmatchedBets, props.matchedBets);
                          // We increment and check the stoplosses
                          if (props.stopLossList[rc.id] !== undefined) {
                              // if it's trailing and the highest LTP went up, then we add a tickoffset
                              const maxLTP = ladders[rc.id].ltp.sort((a, b) => b - a)[0];
                              let adjustedStopLoss = Object.assign({}, stopLossTrailingChange(props.stopLossList, rc.id, currentLTP, maxLTP));

                              // if hedged, get size (price + hedged profit/loss)
                              if (adjustedStopLoss.hedged) {
                                  const newMatchedBets = Object.values(props.matchedBets).filter(bet => parseFloat(bet.selectionId) === parseFloat(adjustedStopLoss.selectionId));

                                  adjustedStopLoss.size = CalculateLadderHedge(parseFloat(adjustedStopLoss.price), newMatchedBets, 'hedged').size
                              }

                              // if it doesn't have a reference or the order has been matched (STOP LOSS)
                              const stopLossMatched = stopLossCheck(adjustedStopLoss, rc.id, currentLTP, props.onPlaceOrder, stopLossOrdersToRemove, adjustedStopLossList, props.unmatchedBets, props.matchedBets);

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
                  if (Object.keys(props.stopEntryList).length > 0) {
                      props.onChangeStopEntryList(newStopEntryList);
                  }
                  if (Object.keys(props.stopLossList).length > 0) {
                      props.onChangeStopLossList(adjustedStopLossList);
                  }
                  setUpdates(ladders);
                  setIsUpdated(false);
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
            if (changes.orc === undefined) return;
              changes.orc.forEach(runner => {
                  if (runner.uo) {
                      runner.uo.forEach(order => {
                          // If the bet isn't in the unmatchedBets, we should delete it.
                          if (order.sr === 0 && order.sm === 0) { // this is what happens when an order doesn't get any matched
                            delete newUnmatchedBets[order.id];
                          } else if (order.sr === 0) { // this is what happens when an order is finished
                            // if they canceled early
                            newMatchedBets[order.id] = Object.assign({}, newUnmatchedBets[order.id], {size: parseFloat(order.sm)});
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
  }, [props.ladders,props.marketStatus, props.inPlay, props.market.inPlayTime, props.pastEventTime]);

  useEffect(() => {
    if (Object.keys(props.unmatchedBets).length > 0) {
      props.socket.emit("order-subscription", {
        customerStrategyRefs: JSON.stringify(Object.values(props.unmatchedBets).map(bet => bet.rfs))
      });
    }
  }, [Object.keys(props.unmatchedBets).length]);

  const cleanupOnMarketClose = (marketId) => {
    window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
  }

  useEffect(() => {
    setInterval(async () => {
      if (marketId) {
        const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
        const currentOrdersObject = {};
        currentOrders.forEach(item => {
          currentOrdersObject[item.betId] = item;
          if (item.status === "EXECUTION_COMPLETE") {
            currentOrdersObject[item.betId].price = item.averagePriceMatched;
          } else {
            currentOrdersObject[item.betId] = item;
            currentOrdersObject[item.betId].price = item.priceSize.price;
          }
        });

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
          }

          if (order.status === "EXECUTION_COMPLETE") {
            loadedMatchedOrders[order.betId] = orderData;
          } else if (order.status === "EXECUTABLE") {
            loadedUnmatchedOrders[order.betId] = orderData;
          }
        })

        props.onChangeOrders({
          matched: loadedMatchedOrders,
          unmatched: loadedUnmatchedOrders
        });
      }
    }, 15000);
  }, [marketId]);

  useEffect(() => {
    fetch(`/api/list-market-pl?marketId=${marketId}`)
    .then(res => res.json())
    .then(res => {
        if (res.result[0] !== undefined) {
          const selectionPL = res.result[0].profitAndLosses.reduce((acc, item) => {
            acc[item.selectionId] = item.ifWin;
            return acc
          }, {})
          props.setMarketPL(selectionPL);
        }
    })
  }, [props.matchedBets])

  const renderView = () => {
    switch (props.view) {
      case "HomeView":
        return <HomeView />;
      case "LadderView":
        return <LadderView />;
      case "GridView":
        return <GridView />;
      default:
        return <HomeView />;
    }
  };

  if (props.isLoading) {
    return <Spinner />;
  } else {
    return (
      <div className="horizontal-scroll-wrapper">
        <div className="root">
          <Title />
          <Siderbar />
          <main className="content">
            <ConnectionBugDisplay 
              connectionError = {connectionError}
              marketId = {marketId} 
              clk = {clk} 
              initialClk = {initialClk} 
              socket = {props.socket} 
              setClk = {setClk} 
              setInitialClk = {setInitialClk} 
            />
            <Draggable />
            {renderView()}
            <PremiumPopup />
          </main> 
        </div>
      </div>
    );
  }
};

const AppWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <App {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    view: state.settings.view,
    isLoading: state.settings.isLoading,
    market: state.market.currentMarket,
    marketStatus: state.market.status,
    eventType: state.market.eventType,
    inPlay: state.market.inPlay,
    pastEventTime: state.market.pastEventTime,
    marketOpen: state.market.marketOpen,
    clk: state.market.clk,
    ladders: state.market.ladder,
    nonRunners: state.market.nonRunners,
    premiumMember: state.settings.premiumMember,
    premiumPopup: state.settings.premiumPopupOpen,
    unmatchedBets: state.order.bets.unmatched,
    matchedBets: state.order.bets.matched,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    fillOrKillList: state.fillOrKill.list,
    layList: state.lay.list,
    backList: state.back.list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /** Settings **/
    setLoading: isLoading => dispatch(actions.setIsLoading(isLoading)),
    setPremiumStatus: isPremium => dispatch(actions.setPremiumStatus(isPremium)),
    onToggleDefaultView: view => dispatch(actions.setDefaultView(view)),
    onToggleActiveView: view => dispatch(actions.setActiveView(view)),
    onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
    onToggleTools: settings => dispatch(actions.toggleTools(settings)),
    onToggleUnmatchedBets: settings =>
      dispatch(actions.toggleUnmatchedBets(settings)),
    onToggleMatchedBets: settings =>
      dispatch(actions.toggleMatchedBets(settings)),
    onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
    onToggleMarketInformation: settings =>
      dispatch(actions.toggleMarketInformation(settings)),
    onUpdateWinMarketsOnly: isChecked => dispatch(actions.setWinMarketsOnly(isChecked)),
    onToggleRules: settings => dispatch(actions.toggleRules(settings)),
    onToggleLadderUnmatched: unmatchedColumn => dispatch(actions.toggleLadderUnmatched(unmatchedColumn)),
    onReceiveStakeBtns: data => dispatch(actions.setStakeBtns(data)),
    onReceiveLayBtns: data => dispatch(actions.setLayBtns(data)),
    onReceiveRightClickTicks: ticks => dispatch(actions.updateRightClickTicks(ticks)),
    onReceiveHorseRaces: horseRaces => dispatch(actions.setHorseRacingCountries(horseRaces)),
    /** Market **/
    onReceiveMarket: market => dispatch(marketActions.loadMarket(market)),
    onReceiveEventType: eventType => dispatch(marketActions.setEventType(eventType)),
    onMarketClosed: () => dispatch(marketActions.closeMarket()),
    onReceiveInitialClk: initialClk => dispatch(marketActions.setInitialClk(initialClk)),
    onReceiveClk: clk => dispatch(marketActions.setClk(clk)),
    onReceiverLadders: ladders => dispatch(marketActions.loadLadder(ladders)),
    onSortLadder: sortedLadder => dispatch(marketActions.setSortedLadder(sortedLadder)),
    onSelectRunner: runner => dispatch(marketActions.setRunner(runner)),
    onUpdateRunners: runners => dispatch(marketActions.loadRunners(runners)),
    onReceiveNonRunners: nonRunners => dispatch(marketActions.loadNonRunners(nonRunners)),
    onChangeExcludedLadders: excludedLadders => dispatch(marketActions.updateExcludedLadders(excludedLadders)),
    onMarketStatusChange: isOpen => dispatch(marketActions.setMarketStatus(isOpen)),
    setInPlay: inPlay => dispatch(marketActions.setInPlay(inPlay)),
    setInPlayTime: time => dispatch(marketActions.setInPlayTime(time)),
    setMarketPL: pl => dispatch(marketActions.setMarketPL(pl)),
    /** Betting Tools **/
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithSocket);