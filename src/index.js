import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login.jsx";
import AppView from "./AppView.jsx";
import AuthRedirect from "./AuthRedirect.jsx";
import BetFairToken from "./Code.jsx";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path="/" exact component={Login}/>
      <Route path="/dashboard" exact component={AppView}/>
      <Route path="/authentication" exact component={AuthRedirect}/>
      <Route path="/code" exact Component={BetFairToken}/>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);