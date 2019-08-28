import React from "react";
import { connect } from 'react-redux';
import Siderbar from "./Sidebar";
import HomeView from "./HomeView/index";
import LadderView from "./LadderView/OddsTable";
import GridView from "./GridView/EventTable";

const App = props => {
  
  let sessionKey = localStorage.getItem("sessionKey");
  let email = localStorage.getItem("username");

  fetch(`/api/load-session?sessionKey=${encodeURIComponent(sessionKey)}&email=${encodeURIComponent(email)}`)
  .then(res => console.log(res));

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
		view: state.settings.view
	}
}

export default connect(mapStateToProps)(App);