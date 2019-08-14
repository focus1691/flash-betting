import React, {useState} from "react";
import Siderbar from "./Sidebar/Container";
import HomeView from "./HomeView/index";
import LadderView from "./LadderView/OddsTable";
import GridView from "./GridView/EventTable";

export default () => {
	const [activeView, setActiveView] = useState(5);

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