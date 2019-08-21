import React, { useState } from "react";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';
import Siderbar from "./Sidebar/Container";
import HomeView from "./HomeView/index";
import LadderView from "./LadderView/OddsTable";
import GridView from "./GridView/EventTable";

const App = props => {
  const [activeView, setActiveView] = useState(5);

  props.socket.emit("load_session", { sessionKey: localStorage.getItem("sessionKey") });
  
  const renderView = (view) => {

    switch (view) {
      case 1:
        return null;
      case 2:
        return null;
      case 3:
        return <HomeView></HomeView>;
      case 4:
        return <LadderView></LadderView>;
      case 5:
        return <GridView></GridView>;
    }
  };

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

const AppWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <App {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(AppWithSocket);