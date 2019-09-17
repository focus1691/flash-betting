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
import FullLadder from "../utils/CreateFullLadder";

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
            props.onSelectRunner(data.result[0].runners[0].metadata);
            props.socket.emit("market-subscription", {
              marketId: data.result[0].marketId
            });
          }
        });
    }
  }, []);

  useEffect(() => {
    /**
     * Listen for Market Change Messages and create/update them
     * @param {obj} data The market change message data: rc: [(atb, atl, batb, batl, tv, ltp, id)]
     */
    props.socket.on("mcm", data => {
      const ladders = {};

      const length = data.rc.length;

      for (var i = 0; i < length; i++) {
        let key = [data.rc[i].id];

        if (key in props.ladders) {
          ladders[key] = props.ladders[key];

          if (data.rc[i].ltp) {
            ladders[key].ltp = [data.rc[i].ltp, ladders[key].ltp[0]];
          }
          if (data.rc[i].tv) {
            ladders[key].tv = [data.rc[i].tv, ladders[key].tv[0]];
          }

          var j;
          ladders[key].fullLadder = Object.assign(
            {},
            props.ladders[key].fullLadder
          );

          // Update the atb values
          if (data.rc[i].atb) {
            for (j = 0; j < data.rc[i].atb.length; j++) {
              let priceKey = data.rc[i].atb[j][0].toFixed(2);
              ladders[key].fullLadder[priceKey].odds = priceKey;
              ladders[key].fullLadder[priceKey].backMatched =
                data.rc[i].atb[j][1];
            }
            let newAtb = ladders[key].atb;
            for (j = 0; j < data.rc[i].atb.length; j++) {
              const odds = data.rc[i].atb[j][0];
              const matched = data.rc[i].atb[j][1];

              const index = SearchInsert(newAtb, parseInt(odds));
              if (odds == newAtb[index]) {
                if (matched == 0) {
                  newAtb.splice(index, 1);
                } else {
                  newAtb[index][1] = matched;
                }
              } else {
                newAtb.splice(index, 0, data.rc[i].atb[j]);
              }
            }
          }

          // Update the atl values
          if (data.rc[i].atl) {
            for (j = 0; j < data.rc[i].atl.length; j++) {
              let priceKey = data.rc[i].atl[j][0].toFixed(2);
              ladders[key].fullLadder[priceKey].odds = priceKey;
              ladders[key].fullLadder[priceKey].layMatched =
                data.rc[i].atl[j][1];
            }
          }
        } else {
          ladders[key] = data.rc[i];
          ladders[key].ltp = [ladders[key].ltp, ladders[key].ltp];
          ladders[key].tv = [ladders[key].tv, ladders[key].tv];
          ladders[key].fullLadder = FullLadder();
          var k;

          if (ladders[key].atb) {
            for (k = 0; k < ladders[key].atb.length; k++) {
              let priceKey = ladders[key].atb[k][0].toFixed(2);
              ladders[key].fullLadder[priceKey].odds = priceKey;
              ladders[key].fullLadder[priceKey].backMatched =
                ladders[key].atb[k][1];
            }
          }
          if (ladders[key].atl) {
            for (k = 0; k < ladders[key].atl.length; k++) {
              let priceKey = ladders[key].atl[k][0].toFixed(2);
              ladders[key].fullLadder[priceKey].odds = priceKey;
              ladders[key].fullLadder[priceKey].layMatched =
                ladders[key].atl[k][1];
            }
          }
        }
      }
      console.log(ladders);
      props.socket.off("mcm");
      props.onReceiverLadders(ladders);
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
              {new Date(props.market.event.openDate).toLocaleTimeString() +
                " " +
                props.market.event.name}
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
    onReceiverLadders: ladders => dispatch(actions2.loadLadder(ladders))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithSocket);
