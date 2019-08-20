import React, { useState } from "react";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';
import { Redirect } from "react-router-dom";
import Siderbar from "./Sidebar/Container";
import HomeView from "./HomeView/index";
import LadderView from "./LadderView/OddsTable";
import GridView from "./GridView/EventTable";

const App = props => {
  const [activeView, setActiveView] = useState(5);
  
  if (!localStorage.getItem("sessionKey")) return <Redirect to='/' />

  props.socket.emit("load_session", { sessionKey: localStorage.getItem("sessionKey") });

  return (
    <div className="horizontal-scroll-wrapper">
      <div className="root">
        <Siderbar></Siderbar>
        <main className="content">
          {renderView(activeView)}
        </main>
      </div>
    </div>
  );
};

const renderView = (activeView) => {
  if (activeView === 1) {

  }
  else if (activeView === 2) {

  }
  else if (activeView === 3) {
    return (
      <HomeView></HomeView>
    );
  }
  else if (activeView === 4) {
    return (
      <LadderView></LadderView>
    );
  }
  else if (activeView === 5) {
    return (
      <GridView></GridView>
    );
  }
}

const AppWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <App {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(AppWithSocket);