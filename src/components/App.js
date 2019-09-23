import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../actions/settings";
import * as actions2 from "../actions/market";
import Siderbar from "./Sidebar";
import HomeView from "./HomeView/";
import LadderView from "./LadderView/";
import GridView from "./GridView/";
import SocketContext from "../SocketContext";
import { Helmet } from "react-helmet";
import SearchInsert from "../utils/SearchInsert";
import getQueryVariable from "../utils/GetQueryVariable";
import { AddRunner } from "../utils/ladder/AddRunner";
import { UpdateRunner } from "../utils/ladder/UpdateRunner";
import { createFullLadder, formatPriceKey } from "../utils/ladder/CreateFullLadder";

const App = props => {
  /**
   * Send the session key to the server to login to BetFair
   */
  let sessionKey = localStorage.getItem("sessionKey");
  let email = localStorage.getItem("username");

  fetch(
    `/api/load-session?sessionKey=${encodeURIComponent(
      sessionKey
    )}&email=${encodeURIComponent(email)}`
  );

  useEffect(() => {
    fetch(`/api/get-user-settings`)
      .then(res => res.json())
      .then(settings => {
        props.onToggleSounds(settings.sounds);
        props.onToggleTools(settings.tools);
        props.onToggleUnmatchedBets(settings.unmatchedBets);
        props.onToggleMatchedBets(settings.matchedBets);
        props.onToggleGraph(settings.graphs);
        props.onToggleMarketInformation(settings.marketInfo);
        props.onToggleRules(settings.rules);
      });
  }, []);

  useEffect(() => {
    let marketId = getQueryVariable("marketId");

    if (marketId !== false) {
      fetch(`/api/get-market-info?marketId=${marketId}`)
        .then(res => res.json())
        .then(data => {
          if (data.result.length > 0) {
            console.log(data.result[0]);

            const runners = {};
            for (let i = 0; i < data.result[0].runners.length; i++) {
              let selectionId = data.result[0].runners[i].selectionId;
              runners[selectionId] = data.result[0].runners[i];

              runners[selectionId].order = {
                visible: false,
                backLay: 0,
                stakeLiability: 0,
                stake: 2,
                price: 0
              };
            }

            props.onUpdateRunners(runners);
            props.onReceiveMarket(data.result[0]);
            props.onSelectRunner(data.result[0].runners[0]);
            props.socket.emit("market-subscription", {
              marketId: data.result[0].marketId
            });
          }
        });
    }
  }, []);

  useEffect(() => {
    /**
     * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
     * @param {obj} data The market change message data: rc: [(atb, atl, batb, batl, tv, ltp, id)]
     */
    props.socket.on("mcm", data => {

      if (!props.marketOpen && data.marketDefinition && data.marketDefinition.status === 'OPEN') {
        props.onMarketStatusChange(true);
      }

      var ladders = {};

      const length = data.rc.length;

      for (var i = 0; i < length; i++) {
        let key = [data.rc[i].id];
        if (key in props.ladders) {
          ladders[key] = UpdateRunner(props.ladders[key], data.rc[i]);
        } else {
          ladders[key] = AddRunner(key, data.rc[i]);
        }
      }
      console.log(ladders);
      props.socket.off("mcm");
      props.onReceiverLadders(ladders);
    });

    /**
     * Listen for Order Change Messages from the Exchange Streaming socket and create/update them
     * @param {obj} data The order change message data: 
     */
    props.socket.on("ocm", data => {
      

      props.socket.off("ocm");
    });

  }, [props.ladders]);

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

  return (
    <div className="horizontal-scroll-wrapper">
      <div className="root">
        {props.marketOpen ? (
          <Helmet>
            <title>
              {`${new Date(props.market.marketStartTime).toLocaleTimeString()} ${props.market.marketName}  ${props.market.event.venue}`}
            </title>
          </Helmet>
        ) : null}
        <Siderbar />
        <main className="content">{renderView()}</main>
      </div>
    </div>
  );
};

const AppWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <App {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const mapStateToProps = state => {
  return {
    view: state.settings.view,
    market: state.market.currentMarket,
    marketOpen: state.market.marketOpen,
    ladders: state.market.ladder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
    onToggleTools: settings => dispatch(actions.toggleTools(settings)),
    onToggleUnmatchedBets: settings =>
      dispatch(actions.toggleUnmatchedBets(settings)),
    onToggleMatchedBets: settings =>
      dispatch(actions.toggleMatchedBets(settings)),
    onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
    onToggleMarketInformation: settings =>
      dispatch(actions.toggleMarketInformation(settings)),
    onToggleRules: settings => dispatch(actions.toggleRules(settings)),
    onReceiveMarket: market => dispatch(actions2.loadMarket(market)),
    onSelectRunner: runner => dispatch(actions2.setRunner(runner)),
    onUpdateRunners: runners => dispatch(actions2.loadRunners(runners)),
    onReceiverLadders: ladders => dispatch(actions2.loadLadder(ladders)),
    onMarketStatusChange: isOpen => dispatch(actions2.setMarketStatus(isOpen))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithSocket);
