import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/settings';
import Siderbar from "./Sidebar";
import HomeView from "./HomeView/index";
import LadderView from "./LadderView/OddsTable";
import GridView from "./GridView/EventTable";

const App = props => {
  
  let sessionKey = localStorage.getItem("sessionKey");
  let email = localStorage.getItem("username");

  fetch(`/api/load-session?sessionKey=${encodeURIComponent(sessionKey)}&email=${encodeURIComponent(email)}`)
  .then(res => console.log(res));

  fetch(`/api/get-user-settings`)
  .then(res => res.json())
  .then(settings =>  {
    props.onToggleSounds(settings.sounds);
    props.onToggleTools(settings.tools);
    props.onToggleUnmatchedBets(settings.unmatchedBets);
    props.onToggleMatchedBets(settings.matchedBets);
    props.onToggleGraph(settings.graphs);
    props.onToggleMarketInformation(settings.marketInfo);
    props.onToggleRules(settings.rules);
    console.log(settings.tools);
  });

  const renderView = () => {
    switch (props.view) {
      case "HomeView":
        return <HomeView/>;
      case "LadderView":
        return <LadderView/>;
      case "GridView":
        return <GridView/>;
      default:
        return <HomeView/>;
    }
  };

  return (
    <div className="horizontal-scroll-wrapper">
      <div className="root">
        <Siderbar></Siderbar>
        <main className="content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
	return {
    view: state.settings.view,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
    onToggleTools: settings => dispatch(actions.toggleTools(settings)),
		onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
		onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
		onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
		onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
		onToggleRules: settings => dispatch(actions.toggleRules(settings)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);