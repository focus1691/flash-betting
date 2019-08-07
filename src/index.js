import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./tpages/Login/Login";
import openSocket from "socket.io-client";
import PersistentDrawerLeft from "./Sidebar/Container.jsx";
import OddsTable from './LadderView/OddsTable.jsx';
import GridTable from './GridView/EventTable.jsx';

const socket = openSocket("http://localhost:8000");

const App = () => {
  return (
  	<div className="horizontal-scroll-wrapper">
    <div className="root">
      <PersistentDrawerLeft></PersistentDrawerLeft>
      <main className="content">
      	<GridTable></GridTable>
      </main>
    </div>
    </div>
  );
};

const Authentication = () => {
  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <Route path="/" component={Login} />
    </div>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);